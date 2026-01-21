# Công Nghệ Bổ Sung cho MovieHub

Tài liệu này bổ sung các công nghệ chưa được liệt kê trong file `BaoCao_MovieHub.md`, đặc biệt tập trung vào các công nghệ liên quan đến **Hệ thống Gợi ý Phim (Movie Recommendation System)**.

---

## 1. Công Nghệ AI/Machine Learning

### 1.1. Google Generative AI SDK (@google/generative-ai)

| Thuộc tính | Chi tiết |
|------------|----------|
| **Version** | ^0.24.1 |
| **Mục đích** | Tích hợp các mô hình AI của Google (Gemini) vào ứng dụng |
| **Sử dụng trong dự án** | Tạo text embeddings cho phim để phục vụ vector similarity search |

**Chức năng chính:**
- Gọi API Gemini để tạo embeddings từ mô tả phim
- Hỗ trợ batch processing cho việc tạo embeddings hàng loạt
- Xử lý rate limiting và retry logic

**File liên quan:**
- `apps/movie-service/src/module/embedding/embedding.service.ts`
- `apps/movie-service/src/module/embedding/embedding.module.ts`

---

### 1.2. Gemini Embedding Model (text-embedding-004)

| Thuộc tính | Chi tiết |
|------------|----------|
| **Model Name** | gemini-embedding-001 / text-embedding-004 |
| **Dimensions** | 768 chiều (768-dimensional vectors) |
| **Mục đích** | Chuyển đổi văn bản (tiêu đề, mô tả phim) thành vector số học |

**Cách hoạt động:**
1. Mô tả phim được gửi đến Gemini API
2. API trả về vector 768 chiều đại diện cho ngữ nghĩa của phim
3. Vector được lưu vào PostgreSQL với pgvector extension

**Ứng dụng:**
- **Similar Movies**: Tìm phim tương tự dựa trên cosine similarity
- **Query-based Recommendations**: Gợi ý phim từ câu hỏi tự nhiên ("phim hành động Việt Nam")
- **For You Recommendations**: Cá nhân hóa gợi ý dựa trên lịch sử đặt vé

---

## 2. Database Extensions

### 2.1. pgvector (PostgreSQL Extension)

| Thuộc tính | Chi tiết |
|------------|----------|
| **Loại** | PostgreSQL Extension |
| **Mục đích** | Lưu trữ và tìm kiếm vector embeddings hiệu quả |
| **Cài đặt** | Tự động qua Docker init script |

**Tính năng:**
- Hỗ trợ kiểu dữ liệu `vector(n)` cho embedding storage
- Tính toán **cosine similarity** (`<=>` operator)
- Tính toán **Euclidean distance** (`<->` operator)
- Tính toán **inner product** (`<#>` operator)

**Cấu hình trong dự án:**

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create movie_embeddings table with vector column
CREATE TABLE IF NOT EXISTS movie_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    embedding vector(768), -- Gemini embedding-001 uses 768 dimensions
    model VARCHAR(50) DEFAULT 'gemini-embedding-001',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(movie_id)
);
```

**File liên quan:**
- `apps/movie-service/docker-init.sql`
- `apps/movie-service/prisma/migrations/20260117_add_pgvector/migration.sql`
- `apps/movie-service/prisma/schema.prisma` (model `MovieEmbedding`)

---

### 2.2. HNSW Indexing (Hierarchical Navigable Small World)

| Thuộc tính | Chi tiết |
|------------|----------|
| **Loại** | Vector Index Algorithm |
| **Mục đích** | Tìm kiếm vector tương tự (ANN - Approximate Nearest Neighbors) |
| **Độ phức tạp** | O(log n) thay vì O(n) cho exact search |

**Ưu điểm:**
- Tốc độ truy vấn nhanh cho dataset lớn
- Cân bằng giữa accuracy và performance
- Hỗ trợ incremental updates (thêm phim mới không cần rebuild index)

**Cấu hình:**

```sql
-- Create HNSW index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_movie_embeddings_embedding 
ON movie_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

---

## 3. Kiến Trúc Hệ Thống Gợi Ý

### 3.1. Recommendation Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RECOMMENDATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   User Query │───▶│  Gemini API  │───▶│  768-dim     │   │
│  │   "phim hành │    │  Embedding   │    │  Vector      │   │
│  │   động hay"  │    └──────────────┘    └──────────────┘   │
│  └──────────────┘              │                 │          │
│                                │                 ▼          │
│                                │    ┌────────────────────┐  │
│                                │    │  pgvector          │  │
│                                │    │  Similarity Search │  │
│                                │    │  (cosine_ops)      │  │
│                                │    └────────────────────┘  │
│                                │                 │          │
│                                ▼                 ▼          │
│                    ┌─────────────────────────────────┐      │
│                    │  Recommendation Results         │      │
│                    │  (Top-K most similar movies)    │      │
│                    └─────────────────────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2. Các API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/recommendations` | POST | Gợi ý phim từ natural language query |
| `/similar/:movieId` | GET | Tìm phim tương tự với phim đã cho |
| `/admin/embeddings/generate/:id` | POST | Tạo embedding cho một phim |
| `/admin/embeddings/batch` | POST | Tạo embeddings cho tất cả phim chưa có |

### 3.3. Thuật toán Ranking

1. **Cosine Similarity**: Đo độ tương đồng ngữ nghĩa giữa các vectors
2. **MMR (Maximal Marginal Relevance)**: Đảm bảo đa dạng trong kết quả gợi ý
3. **Weighted Scoring**: Kết hợp nhiều yếu tố (rating, popularity, recency)

---

## 4. Các Công Nghệ Bổ Sung Khác

### 4.1. Email & Notifications

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **nodemailer** | ^7.0.11 | Gửi email xác nhận đặt vé, thông báo |
| **qrcode** | ^1.5.4 | Tạo mã QR cho vé điện tử (server-side) |
| **qrcode.react** | ^4.2.0 | Hiển thị mã QR trong React components |

### 4.2. PDF & Image Processing

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **jspdf** | ^3.0.4 | Tạo file PDF cho vé điện tử |
| **html2canvas** | ^1.4.1 | Chụp ảnh HTML để nhúng vào PDF |

### 4.3. UI/UX Enhancements

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **framer-motion** | ^12.23.24 | Animation library cho React |
| **swiper** | ^12.0.2 | Carousel/slider cho hiển thị phim |
| **embla-carousel-react** | ^8.6.0 | Carousel component (shadcn/ui) |
| **react-snowfall** | ^2.4.0 | Hiệu ứng tuyết rơi (seasonal) |
| **recharts** | ^2.15.4 | Biểu đồ thống kê cho admin dashboard |
| **sonner** | ^2.0.7 | Toast notifications |

### 4.4. Utilities

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **date-fns** | ^4.1.0 | Xử lý ngày tháng (thay thế moment) |
| **moment** | ^2.30.1 | Xử lý ngày tháng (legacy) |
| **zod** | ^4.1.12 | Schema validation |
| **nestjs-zod** | ^5.0.1 | Tích hợp Zod với NestJS |
| **decimal.js** | ^10.6.0 | Xử lý số thập phân chính xác (giá tiền) |
| **use-debounce** | ^10.0.6 | Debounce hook cho React |
| **ioredis** | ^5.8.1 | Redis client cho Node.js |
| **lru-cache** | ^11.2.2 | In-memory caching |

### 4.5. Development & Build Tools

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **@swc/core** | ^1.13.5 | Fast TypeScript/JavaScript compiler |
| **tsx** | ^4.20.0 | TypeScript execution for Node.js |
| **supertest** | ^7.1.4 | HTTP testing library |

---

## 5. So Sánh với BaoCao_MovieHub.md

### Đã có trong BaoCao_MovieHub.md:
- ✅ TypeScript, React, Next.js
- ✅ Zustand, TanStack Query
- ✅ NestJS, Prisma, Socket.io
- ✅ Redis, PostgreSQL
- ✅ Clerk, Docker, NX

### Chưa có trong BaoCao_MovieHub.md (bổ sung trong file này):
- ❌ **@google/generative-ai** (AI embeddings)
- ❌ **pgvector** (vector database extension)
- ❌ **HNSW indexing** (vector search algorithm)
- ❌ **Gemini embedding model** (text-embedding-004)
- ❌ **nodemailer** (email)
- ❌ **qrcode/qrcode.react** (QR generation)
- ❌ **jspdf/html2canvas** (PDF generation)
- ❌ **framer-motion** (animations)
- ❌ **swiper** (carousel)
- ❌ **recharts** (charts)
- ❌ **zod** (validation)
- ❌ **date-fns** (date utilities)
- ❌ **decimal.js** (precise calculations)

---

*Tài liệu này được tạo để bổ sung cho BaoCao_MovieHub.md, tập trung vào các công nghệ AI/ML và các utility packages quan trọng.*
