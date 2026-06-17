Tiếp tục hoàn thiện Parking Building Management System: desktop 1440x900, sidebar trái, topbar xanh, nền trắng/xám, bảng phân trang, Search xanh, Reset xám, Add xanh lá. Chỉ ô tô dùng slot/reservation; xe máy giữ luồng cũ.

1. USER – RESERVE PARKING SLOT
   Chỉ user có vé tháng ô tô còn hiệu lực.
   Form: Monthly Card, Vehicle Plate, Reservation Date, Expected Arrival Time, Floor, Zone, Slot.
   Chỉ được đặt trong 7 ngày tính từ hôm nay; mỗi xe tối đa 1 slot/ngày.
   Khi bấm Reserve, kiểm tra vé tháng, ngày, trùng reservation và slot trống. Thành công: Confirmed, gửi “Reservation Confirmed”, mở Reservation Detail.
   Slot map: Available xanh, Reserved vàng, Occupied đỏ, Disabled xám.
   Slot code: B1-A01, B1-A02, B2-A01.

2. USER – MY RESERVATIONS
   Filter: Date, Slot Code, Status.
   Table: ID, Date, Expected Arrival, Floor, Zone, Slot, Vehicle, Status.
   Actions: View, Cancel, Reserve Again.
   Chỉ được hủy trước giờ đến ít nhất 6 giờ.
   Status:
   Confirmed, Awaiting User Confirmation, Reassignment Required, Checked In, Completed, Cancelled by User, Cancelled by System, No-show.

Nếu quá giờ đến 2 giờ chưa check-in: No-show; slot mở cho xe vãng lai trong phần còn lại của ngày, không mở reservation mới cùng slot trong ngày.
Đếm No-show theo rolling 30 days. Đủ 3 lần: khóa đặt slot 7 ngày. Hết khóa tự mở và reset counter.

3. ALTERNATIVE SLOT
   Nếu slot bị xe khác chiếm, Staff đề xuất slot mới.
   Reservation thành Awaiting User Confirmation; slot mới Hold 30 phút.
   User chọn Accept hoặc Reject.
   Confirmed Verbally chỉ dùng khi user đồng ý đổi slot; Old/New Slot phải khác nhau. Tự lấy Staff ID/Name, bắt buộc Method và Note.
   Hết 30 phút: giải phóng hold, chuyển Reassignment Required.
   Staff có 30 phút xử lý tiếp. Xe chưa check-in thì tự Cancelled by System; xe đã check-in thì escalate Admin.
   Admin SLA 30 phút; quá hạn đánh dấu Overdue và nhắc mỗi 30 phút.

4. ADMIN – FLOOR & SLOT
   Floor Information chỉ View/Edit, không Add/Delete.
   Bảng: Floor, Total Car Slots, Available on Selected Date, Reserved on Selected Date, Occupied Now, Disabled.
   Parking Slot Management: filter Floor, Zone, Status; Add/Edit/Disable/Enable.
   Chỉ Disable khi không Occupied và không có reservation hoạt động trong tương lai.
   Enable trả slot về Available ở thời điểm không có reservation.

5. STAFF – VEHICLE ENTRY
   Với ô tô không reservation, gợi ý slot sau khi lọc Car, Active, Available, không bị reserve.
   Hiển thị Suggested Slot, Floor, Zone, Reason, Alternative Slots.
   Staff được override nhưng bắt buộc lý do; lưu slot gợi ý, slot chọn, Staff và thời gian.
   Force Check-out bắt buộc Reason và lưu audit.

6. VIOLATION & PENALTY
   Staff tạo violation; Admin Approve/Reject.
   Fields: ID, Vehicle Plate, User, Ticket/Monthly Card, Slot, Type, Amount, Evidence, Related Request ID, Created By, Status.
   Types: Wrong Slot, Overnight, Overtime.
   Penalty status:
   Pending Approval, Approved-Unpaid, Paid, Waived, Refund Pending, Refund Disputed, Refunded, Rejected.
   Nếu Penalty Appeal Pending/Processing: khóa Mark As Paid, hiện “Penalty is under appeal”.
   Appeal Approved: Approved-Unpaid → Waived; Paid → Refund Pending.
   Appeal Rejected: giữ trạng thái cũ, mở lại thu tiền.

7. USER – MY PENALTIES
   Filter: Date, Type, Status.
   Table: Penalty ID, Vehicle, Type, Amount, Date, Status.
   Actions: View, Submit Appeal, Report Refund Not Received.
   Submit Appeal tự điền Penalty ID và thông tin liên quan.
   Report Refund Not Received tạo request liên kết Penalty ID; penalty thành Refund Disputed và gửi thông báo.
   Admin: Initiate Refund Again → Refund Pending → nhập Amount, Method, Reference Code → Refunded → Request Resolved.

8. REQUEST SYSTEM
   Types:
   Wrong Slot Parking Report, Cannot Enter, Cannot Exit, Monthly Card Information Error, Penalty Appeal, Vehicle Information Update, Report Refund Not Received.
   User: Create Request, My Requests.
   Admin: Request Management; filter Type, Status, Date; Approve, Reject, Assign Staff.
   Staff: Assigned Requests; filter Type, Status, Date, Keyword; Start Processing, Add Note, Mark Resolved.
   Violation từ Wrong Slot request phải lưu Related Request ID.

9. NOTIFICATIONS
   Thêm icon chuông và màn Notifications.
   Thông báo: Reservation Confirmed, Cancelled by System, No-show, Privilege Locked/Restored, Alternative Slot Proposed/Expired, Reassignment Required, Penalty Issued, Appeal Result, Refund Disputed/Processing/Completed, Request Approved/Rejected.

10. OPERATIONAL AUDIT LOG
    Admin screen; filter Event Type, Performer, Vehicle, Slot, Date.
    Dùng một bảng có action_type.
    Events: Slot Override, Alternative Slot Proposed/Accepted/Rejected/Expired, Force Check-out, Slot Disabled/Enabled, Reservation Cancelled, Privilege Locked/Restored, Refund Status Updated.
    Table: Log ID, Event Type, Performed By, Time, Vehicle, Old Slot, New Slot, Reason, Reservation ID, Request ID, Detail.