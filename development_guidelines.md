# Quy tắc Tổ chức Thư mục và Chia File (FE & BE)

Tài liệu này định nghĩa cấu trúc và quy tắc phân chia file cho cả dự án **Backend (Spring Boot)** và **Frontend (React + TypeScript)** nhằm đảm bảo tính nhất quán, dễ mở rộng, bảo trì và làm việc nhóm.

---

## 1. BACKEND (Spring Boot) - Quy tắc Chia File

Chúng tôi sử dụng mô hình kiến trúc phân lớp tiêu chuẩn (**layered architecture**). Mỗi file trong Backend phải có nhiệm vụ rõ ràng và không chồng chéo trách nhiệm.

### 1.1 Cấu trúc Thư mục mẫu
```text
src/main/java/com/parking/pbms/
├── config/          # Cấu hình hệ thống (CORS, Security, Swagger, Database...)
├── controller/      # Tiếp nhận HTTP Request, xử lý DTO & Validation, trả về HTTP Response
├── service/         # Giao tiếp chứa logic nghiệp vụ (Interface & Implementation)
│   └── impl/        # Triển khai thực tế của các Service
├── repository/      # Truy xuất cơ sở dữ liệu (Spring Data JPA)
├── model/           # Các Entity ánh xạ 1-1 với bảng trong Database
├── dto/             # Đối tượng vận chuyển dữ liệu giữa các lớp (Request & Response)
├── exception/       # Quản lý Exception chung và các Exception tùy chỉnh
└── utils/           # Các lớp tiện ích dùng chung (DateUtils, StringUtils...)
```

### 1.2 Quy tắc chia file chi tiết

#### Layer 1: Model (Entity)
- **Nhiệm vụ**: Ánh xạ trực tiếp với bảng cơ sở dữ liệu MySQL thông qua JPA (`@Entity`).
- **Quy tắc**:
  - Không chứa logic nghiệp vụ phức tạp.
  - Sử dụng **Lombok** để giảm mã mẫu (`@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`).
  - Giữ các quan hệ `@ManyToOne`, `@OneToMany` an toàn (sử dụng Lazy Loading để tránh N+1 Query).
  - *Ví dụ*: `User.java`, `Card.java`.

#### Layer 2: Repository
- **Nhiệm vụ**: Tương tác trực tiếp với Database.
- **Quy tắc**:
  - Kế thừa `JpaRepository<Entity, KeyType>` hoặc `JpaSpecificationExecutor`.
  - Không viết các truy vấn SQL trực tiếp trong Controller hay Service. Tất cả các câu lệnh Query (`@Query`) phức tạp phải nằm ở đây.
  - *Ví dụ*: `UserRepository.java`, `CardRepository.java`.

#### Layer 3: Service Layer (Nghiệp vụ)
- **Nhiệm vụ**: Chứa logic xử lý, kiểm tra điều kiện, tính toán phí xe, điều phối giao dịch (`@Transactional`).
- **Quy tắc**:
  - Nên tách biệt **Interface** (nằm ở `service/`) và **Implementation** (nằm ở `service/impl/`) để đảm bảo tính lỏng lẻo (loose coupling) và dễ viết Unit Test.
  - **Không** nhận trực tiếp thực thể Entity từ Client, cũng như **không** trả về Entity trực tiếp ra Controller nếu không cần thiết; nên chuyển đổi qua DTO.
  - *Ví dụ*: `CardService.java` (Interface) và `CardServiceImpl.java` (Class).

#### Layer 4: DTO (Data Transfer Object)
- **Nhiệm vụ**: Nhận dữ liệu đầu vào (Request DTO) hoặc chuẩn hóa dữ liệu đầu ra (Response DTO).
- **Quy tắc**:
  - **Request DTO**: Chứa annotation validation như `@NotBlank`, `@NotNull`, `@Min`, `@Pattern`...
  - **Response DTO**: Ẩn các thông tin nhạy cảm (như mật khẩu, dữ liệu hệ thống) trước khi gửi về client.
  - *Ví dụ*: `UserLoginRequest.java`, `UserProfileResponse.java`.

#### Layer 5: Controller (API Entrypoint)
- **Nhiệm vụ**: Tiếp nhận Request từ Frontend, kiểm tra tính hợp lệ sơ bộ (`@Valid`), gọi Service tương ứng và trả về `ResponseEntity`.
- **Quy tắc**:
  - **Không viết logic nghiệp vụ (if-else kiểm tra điều kiện phức tạp, query DB) ở đây.**
  - Mọi Controller phải có `@RestController` và cấu hình `@RequestMapping("/api/v1/...")`.
  - Trả về cấu trúc thống nhất (ví dụ: `ApiResponse<T>` chứa status, message, data).
  - *Ví dụ*: `AuthController.java`, `CardController.java`.

#### Layer 6: Global Exception Handler
- **Nhiệm vụ**: Bắt các lỗi xảy ra trong ứng dụng và trả về format lỗi chuẩn hóa cho FE.
- **Quy tắc**:
  - Tạo một class `@RestControllerAdvice` để gom tất cả các Exception Handler về một mối.
  - Định nghĩa rõ ràng mã lỗi ứng dụng để FE dễ dàng hiển thị thông báo tương ứng.

---

## 2. FRONTEND (React + TypeScript) - Quy tắc Chia File

Để đảm bảo dự án React không bị phình to và lộn xộn (spaghetti code), chúng ta phân chia code theo thành phần nghiệp vụ và tính tái sử dụng.

### 2.1 Cấu trúc Thư mục mẫu (Khuyên dùng)
```text
src/
├── assets/          # Hình ảnh, icon, font tĩnh
├── components/      # Các UI component có thể tái sử dụng (Button, Table, Modal...)
│   └── ui/          # Các component cơ bản (thường từ thư viện như shadcn/ui)
├── pages/           # Các màn hình lớn đại diện cho mỗi Route (Dashboard, Login, CardList...)
├── services/        # Nơi gọi API (sử dụng axios hoặc fetch)
├── hooks/           # Custom React Hooks chứa logic state dùng chung (useAuth, useLocalStorage...)
├── context/         # Quản lý state toàn cục (AuthContext, ThemeContext...)
├── types/           # Định nghĩa các type và interface của TypeScript (User, Card, Ticket...)
├── utils/           # Các hàm bổ trợ helper (format tiền tệ, format ngày tháng...)
├── routes/          # Cấu hình điều hướng phân quyền (AppRoutes.tsx)
├── App.tsx          # Điểm lắp ráp layout chính và routing
└── main.tsx         # Điểm khởi chạy React app
```

### 2.2 Quy tắc chia file chi tiết

#### 1. Page vs Component
- **Page (Màn hình lớn)**:
  - Đặt trong thư mục `pages/` (hoặc cấu trúc theo phân hệ như `src/app/components/...` nếu dự án cũ đã có sẵn cấu trúc tương tự).
  - Một Page đại diện cho một màn hình hoàn chỉnh. Page chịu trách nhiệm quản lý state chính, fetching data từ API Services, và truyền data xuống cho các component con.
- **Component (Thành phần giao diện)**:
  - Đặt trong `components/`.
  - Component nên là **Dumb Component** (chỉ nhận dữ liệu qua `props`, hiển thị giao diện và đẩy sự kiện lên cha thông qua callback). Hạn chế gọi API trực tiếp bên trong component nhỏ.

#### 2. Tách biệt Logic gọi API (Service Layer)
- **Quy tắc**:
  - Không gọi trực tiếp `fetch()` hoặc `axios.get()` bên trong UI component của React.
  - Tạo các hàm API trong thư mục `services/` (hoặc `api/`).
  - *Ví dụ*: Tạo `services/cardService.ts` chứa các hàm `getCards()`, `createCard(data)`. Khi Page hoặc Component cần dữ liệu, chỉ việc import hàm này để gọi. Việc này giúp quản lý tập trung token, URL gốc, header, và dễ dàng mock data khi cần.

#### 3. Sử dụng Custom Hooks cho logic phức tạp
- **Quy tắc**:
  - Khi một Page có quá nhiều dòng code xử lý logic (ví dụ: bộ lọc tìm kiếm, phân trang, đóng mở modal, validate...), hãy tách logic đó ra thành một **Custom Hook** (ví dụ: `hooks/useCardManagement.ts`).
  - File Page lúc này chỉ tập trung vào việc render giao diện JSX sạch sẽ.

#### 4. TypeScript Types / Interfaces
- **Quy tắc**:
  - Tuyệt đối hạn chế sử dụng kiểu `any`.
  - Định nghĩa rõ ràng cấu trúc dữ liệu trả về từ backend trong `types/` (ví dụ: `types/card.ts`). Các interface này phải khớp với DTO của Backend.

---

## 3. Quy tắc đặt tên đồng bộ (FE & BE)

| Đối tượng | Backend (Java) | Frontend (TypeScript) | Ví dụ |
| :--- | :--- | :--- | :--- |
| **Tên File/Class** | `PascalCase` | `PascalCase` (cho component), `camelCase` (cho helpers/api) | BE: `CardService.java`<br>FE: `CardList.tsx`, `apiClient.ts` |
| **Biến & Hàm** | `camelCase` | `camelCase` | BE: `checkInVehicle(...)`<br>FE: `handleCheckIn(...)` |
| **API Endpoints** | `kebab-case` | `kebab-case` | `/api/v1/card-groups` |
| **Constants** | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` | BE: `DEFAULT_PAGE_SIZE = 10`<br>FE: `API_BASE_URL` |
| **Database Tables** | `snake_case` (số nhiều) | - | `card_groups`, `parking_slots` |

---

## 4. Quy trình Tích hợp API giữa FE và BE

1. **Thống nhất DTO**: Trước khi code, lập trình viên FE và BE cần thống nhất cấu trúc JSON đầu vào (Request) và đầu ra (Response) của API.
2. **Mocking**: Frontend sử dụng mock data dựa trên DTO đã thống nhất để dựng giao diện trước.
3. **CORS Configuration**: Backend phải cho phép origin của FE (ví dụ: `http://localhost:5173`) được gọi API thông qua cấu hình `WebConfig`.
4. **Environment Variables**: Frontend quản lý URL của Backend qua file `.env` (ví dụ: `VITE_API_URL=http://localhost:8080/api/v1`).
