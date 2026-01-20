import { Button } from '@movie-hub/shacdn-ui/button';
import Image from 'next/image';

interface FoodCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  inventory: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export const FoodCard = ({
  id,
  name,
  price,
  image,
  quantity,
  inventory,
  onIncrement,
  onDecrement,
}: FoodCardProps) => {
  return (
    <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm text-white rounded-2xl overflow-hidden border border-slate-700/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:scale-105">
      {/* Image container with overlay */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Quantity badge */}
        {quantity > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg animate-in fade-in zoom-in">
            {quantity}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-white line-clamp-2 min-h-[3.5rem]">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-xl">
              {price.toLocaleString()}₫
            </span>
            {inventory <= 5 && inventory > 0 && (
              <span className="text-xs text-orange-400 bg-orange-400/20 px-2 py-0.5 rounded-full">
                Còn {inventory}
              </span>
            )}
          </div>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDecrement(id)}
            disabled={quantity === 0}
            className="h-10 w-10 rounded-full bg-slate-700/50 border-slate-600 hover:bg-slate-600 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span className="text-lg font-bold">-</span>
          </Button>
          
          <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
            {quantity}
          </span>
          
          <Button
            size="sm"
            disabled={quantity >= inventory}
            onClick={() => onIncrement(id)}
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/30"
          >
            <span className="text-lg font-bold">+</span>
          </Button>
        </div>

        {/* Out of stock overlay */}
        {inventory === 0 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <p className="text-red-400 font-bold text-lg">Hết hàng</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
