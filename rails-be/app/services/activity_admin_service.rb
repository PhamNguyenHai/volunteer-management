class ActivityAdminService 
    def self.getAllActivities (params)
       begin

          activities = Activity.left_joins(student_activity: :rating)
          .select('activity.*, COALESCE(ROUND(AVG(rating.RatingStar), 2), 0) AS averageRating', 'COALESCE(COUNT(student_activity.ActivityCode), 0) AS numOfParticipant')
          .group('activity.ActivityCode')

          activities.each do |activity|
            activity['averageRating'] = activity['averageRating'].to_f
          end
          # Phân trang, lọc, sắp xếp dữ liệu
          processedData = PaginationSortSearch.dataExploration(activities, params, "ActivityName")

          # Xử lý lỗi khi thực hiện xử lý dữ liệu
          unless processedData[:success]
            return {success: false, message: processedData[:message], status: processedData[:status]}
          end

          # Chuyển dữ liệu đầu ra thành camel case
          result = CamelCaseConvert.convert_to_camel_case(processedData[:data].to_a)
            return {success: true, message: "Hiển thị danh sách hoạt động", data: {listData: result, totalCount: processedData[:totalCount]}, status: 200}
        rescue StandardError => e
            return { success: false, message: e.message, status: 400 }
        end
    end

    def self.getActivityById (activityCode)
        begin
            activity = Activity.find_by(ActivityCode: activityCode)
            if activity
                return {success: true, message: "Hiển thị hoạt động theo mã hoạt động", data: activity, status: 200}
            else 
                return {success: false, message: "Không tìm thấy hoạt động", status: 400}
            end 
        rescue StandardError => e
            return { success: false, message: e.message, status: 400 }
        end
    end

     # Hàm kiểm tra mảng mã hoạt động đầu vào có lỗi không
     def self.validate_input(arr_activity_code)
        error_results = []
        validate_result = true
      
        arr_activity_code.each do |activity_code|
            activity = Activity.find_by(ActivityCode: activity_code)
        
            # Kiểm tra mã hoạt động có tồn tại trên hệ thống?
            unless activity
                error_results <<  "Không tồn tại mã hoạt động #{activity_code}" 
                validate_result = false
                next
            end
        
            # Kiểm tra hoạt động có sinh viên nào tham gia chưa
            student_activity = StudentActivity.find_by(ActivityCode: activity_code)
            if student_activity
                error_results <<  "Hoạt động #{activity_code} đã có sinh viên tham gia. Không thể xóa" 
                validate_result = false
                next
            end
        
        end
      
        { result: validate_result, message: error_results }
    end 

    # Hàm xóa nhiều
    def self.deleteActivity(arrActivityCode)
        begin
          validate_result = validate_input(arrActivityCode)
      
          if validate_result[:result]
            arrActivityCode.each do |activityCode|
              activity = Activity.find_by(ActivityCode: activityCode)
              activity.destroy if activity
            end
            return { success: true, message: "Xóa hoạt động thành công", status: 200 }
          else
            return { success: false, message: validate_result[:message], status: 400 }
          end
        rescue ActiveRecord::InvalidForeignKey => e
          return { success: false, message: "Không thể xóa hoạt động khi đã có sinh viên tham gia", status: 400 }
        rescue StandardError => e
          return { success: false, message: e.message, status: 400 }
        end
    end

    # Hàm xóa một
    def self.deleteActivityOne (activityCode)
      begin
          activity = Activity.find_by(ActivityCode: activityCode)
          if activity
              activity.destroy
              return {success: true, message: "Xóa hoạt động thành công",status: 200}
          else 
              return {success: false, message: "Hoạt động không tồn tại", status: 404}
          end
      rescue ActiveRecord::InvalidForeignKey => e
        return { success: false, message: "Không thể xóa hoạt động khi đã có sinh viên tham gia", status: 400 }
      rescue StandardError => e
        return { success: false, message: e.message, status: 400 }
      end
  end

  # Hàm update
  def self.updateActivity(activityCode, payload)
    begin
      activity = Activity.find_by(ActivityCode: activityCode)
      
      if activity
          if activity.update(payload)
              activity.UpdatedAt = Time.now
              activity.save
              return { success: true, message: "Cập nhật hoạt động thành công" }
          else
              return { success: false, message: "Có lỗi khi cập nhật hoạt động", errors: activity.errors.full_messages, status: :unprocessable_entity }
          end
      else
          raise ActiveRecord::RecordNotFound.new("Không tìm thấy thông tin hoạt động")
      end

    rescue ActiveRecord::RecordNotFound => e
        return { success: false, message: e.message, status: 404 }
    rescue StandardError => e
        return { success: false, message: e.message, status: 400 }
    end
  end

  # Hàm tạo
  def self.createActivity(payload)
    begin
      activity = Activity.new(payload)
      activity.CreatedAt = Time.now
      if activity.save
        return { success: true, message: "Tạo mới hoạt động thành công", status: 200 }
      else
        return { success: false, message: "Có lỗi khi thêm hoạt động", errors: activity.errors.full_messages, status: :unprocessable_entity }
      end
    rescue StandardError => e
      return { success: false, message: e.message, status: 400 }
    end
  end

end