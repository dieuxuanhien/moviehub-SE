'use client';

import { useBookingStore } from '@/stores/booking-store';
import { useCallback, useState } from 'react';
import { FoodCard } from './_components/food-card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@movie-hub/shacdn-ui/select';
import { useGetConcessions } from '@/hooks/concession-hooks';
import { ConcessionCategory } from '@movie-hub/shared-types/booking/enum/concession';
import type { ConcessionDto } from '@/libs/types/concession.type';
import { Loader } from '@/components/loader';
import { toast } from 'sonner';

export const FoodSelector = ({ cinemaId }: { cinemaId?: string }) => {
  const { concessionSelections, setConcessionSelection } = useBookingStore();

  const [category, setCategory] = useState<ConcessionCategory | 'all'>('all');

  const { data, isLoading } = useGetConcessions({
    category: category === 'all' ? undefined : (category as ConcessionCategory),
    available: true,
    cinemaId: cinemaId || undefined,
  });

  const foodList = data || [];

  // Debug logging
  console.log('FoodSelector - category:', category);
  console.log('FoodSelector - cinemaId:', cinemaId);
  console.log('FoodSelector - foodList:', foodList);
  console.log('FoodSelector - foodList categories:', foodList.map((f) => ({ name: f.name, category: f.category })));

  const handleIncrement = useCallback(
    (food: ConcessionDto) => {
      const current = concessionSelections[food.id] || 0;
      if (current >= food.inventory) {
        toast.error('Đã đat đến số lượng tối đa có thể mua cho món này.');
        return;
      }

      setConcessionSelection(food.id, current + 1, {
        name: food.name,
        price: food.price,
      });
    },
    [concessionSelections, setConcessionSelection]
  );

  const handleDecrement = useCallback(
    (food: ConcessionDto) => {
      const current = concessionSelections[food.id] || 0;

      if (current > 0) {
        setConcessionSelection(food.id, current - 1, {
          name: food.name,
          price: food.price,
        });
      }
    },
    [concessionSelections, setConcessionSelection]
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4">
      {/* Header with gradient */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          🍿 Chọn đồ ăn
        </h1>
        <p className="text-gray-400 text-sm">Thưởng thức đồ ăn ngon trong suất chiếu</p>
      </div>

      {/* Select category with improved styling */}
      <div className="flex justify-center">
        <Select
          value={category}
          onValueChange={(val) => setCategory(val as ConcessionCategory | 'all')}
        >
          <SelectTrigger className="w-[260px] h-12 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm text-white border border-slate-600/50 hover:border-primary/50 transition-all shadow-lg">
            <SelectValue placeholder="Chọn loại" />
          </SelectTrigger>

          <SelectContent className="bg-slate-900 text-white border-slate-700">
            <SelectItem value="all" className="cursor-pointer hover:bg-primary/20">🎯 Tất cả mặt hàng</SelectItem>
            <SelectItem value={ConcessionCategory.FOOD} className="cursor-pointer hover:bg-primary/20">🍔 Thức Ăn</SelectItem>
            <SelectItem value={ConcessionCategory.DRINK} className="cursor-pointer hover:bg-primary/20">
              🥤 Đồ Uống
            </SelectItem>
            <SelectItem value={ConcessionCategory.COMBO} className="cursor-pointer hover:bg-primary/20">🍿 Combo</SelectItem>
            <SelectItem value={ConcessionCategory.MERCHANDISE} className="cursor-pointer hover:bg-primary/20">🎁 Hàng Hóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="col-span-full flex justify-center items-center py-20">
          <div className="text-center space-y-4">
            <Loader size={48} />
            <p className="text-gray-400">Đang tải danh sách...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && foodList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50">
          <div className="text-7xl mb-4">🧐</div>
          <p className="text-xl text-gray-300 font-semibold">Không tìm thấy món nào</p>
          <p className="text-sm text-gray-500 mt-2">Vui lòng thử chọn danh mục khác</p>
        </div>
      )}

      {/* Food grid with improved spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!isLoading &&
          foodList.length > 0 &&
          foodList.map((food) => (
            <FoodCard
              key={food.id}
              id={food.id}
              name={food.name}
              price={food.price}
              image={food.imageUrl || '/images/placeholder-bg.png'}
              inventory={food.inventory}
              quantity={concessionSelections[food.id] || 0}
              onIncrement={() => handleIncrement(food)}
              onDecrement={() => handleDecrement(food)}
            />
          ))}
      </div>
    </div>
  );
};
