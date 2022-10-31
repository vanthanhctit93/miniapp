![Image](https://fptplay.vn/images/logo-2.png)

# Document MiniApp
```python
# Name: MiniApp
# Version: 1.0.0
# Author: 
# Description:
# License: FPL - WEB/APP ROOM
# Create_at: October 28, 2022
```

## Guide Dev Native

Cập nhật danh sách methods ở version: 1.0.0

    1. getUserInfo
    2. getDeviceInfo
    3. requestPermission
    4. checkPermission
    5. requestUserConsents
    6. getUserConsents

### <em>getUserInfo()</em>
Lấy thông tin người dùng

_Request:_
```python
    Get api user/info
```
_Response:_
```python
    # Success
    {                                      # Object
        status: 1,                         # String
        message: 'Hiển thị câu thông báo', # String
        data {                             # Object
            name: 'String';                # Hello World
            email: 'String';               # helloworld@gmail.com
            phone: 'String';               # 0987654321
        }
    }

    # Fail
    {                                      # Object
        status: 1,                         # String
        message: 'Hiển thị câu thông báo', # String
        data: {}                           # Object
    }
```
### <em>getDeviceInfo()</em>
Lấy thông tin thiết bị

_Request:_
```python
Lấy thông tin thiết bị từ phần config của App
```
_Response:_
```python
    device: {                       # Object
        model: 'String',            # Mẫu thiết bị
        version: 'String',          # Phiên bản thiết bị
        name: 'String',             # Tên thiết bị
        macAddress: 'String'        # Địa chỉ mac
    }
```

### <em>requestPermission(permission, callback)</em>
Yêu cầu quyền truy cập trên thiết bị như vị trí, dữ liệu, liên hệ, thư viện,...

permission(String): 'storage' | 'location' | 'contacts'

callback(Callback): callback

_Request:_
```python
    requestPermission('location', (data) => {
        console.log(data);
    })
```
_Response:_
```python
    {
        status: 1 - Success/0 - Fail           # String
        message: 'Hiển thị câu thông báo',     # String
        data: string
    }

    # string: 
    'granted': Đã được cấp quyền, 
    'denied': Không được cấp quyền, 
    'unavailable': Quyền được yêu cầu không tồn tại
```
### <em>checkPermission(permission, callback)</em>
Kiểm tra quyền truy cập cho phép sử dụng

permission(String): 'storage' | 'location' | 'contacts'

callback(Callback): callback

_Request:_
```python
    checkPermission('location', (data) => {
        console.log(data);
    })
```
_Response:_
```python
    {
        status: 1 - Success/0 - Fail           # String
        message: 'Hiển thị câu thông báo',     # String
        data: string
    }

    # string: 
    'granted': Được quyền, 
    'denied': Không được quyền, 
    'unavailable': Quyền được yêu cầu không tồn tại
```

### <em>requestUserConsents(options, callback)</em>
Yêu cầu truy cập thông tin người dùng. Một popup sẽ xuất hiện để yêu cầu người dùng cung cấp thông tin

options (Object): là một mảng chứa các quyền cần chia sẻ

callback (Function): Hàm callback với dữ liệu trả từ request

permissions (Array): Mảng chứa các object quyền cần được cấp

role (String): Tên quyền cần được cấp 'name' | 'location' | 'deviceName' | 'email' | 'phone',...

required (Boolean): Thiết lập các quyền yêu cầu chia sẻ dữ liệu người dùng trở thành bắt buộc quyền cần được cấp (true/false)

_Request:_
```python
    requestUserConsents({
        'permissions': [
            {
                'role': 'String',
                'require': Boolean
            },
            {
                'role': 'String'
                'require': Boolean
            },
            {
                'role': 'String',
                'require': Boolean
            },
        ]    
    }, (data) => {
        console.log(data)
    }
```
_Response:_
```python
# status = 1: Người dùng chấp nhận chia sẻ quyền
# status = 2: Người dùng huỷ chia sẻ quyền
# status = 3: Data truyền vào không có quyền xin chia sẻ dữ liệu từ người dùng / Truyền sai Data

    {	
        status: 1,                          # String
        message: 'Hiển thị câu thông báo',  # String
        data: {                             # Object
            name: 'John Doe',               # String
            phone: '0987654321'             # String
        }
    }

    {
        status: 2 or 3,                     # String 
        message: 'Hiển thị câu thông báo',  # String
        data: {}                            # Object
    }
```
### <em>getUserConsents(options, callback)</em>
Truy cập thông tin người dùng đã được cấp quyền. Dữ liệu sẽ được trả qua callback

options(Object): là một mảng chứa các quyền cần chia sẻ

callback (Function): Hàm callback với dữ liệu trả từ request

Tạo một trường với tên là permissions.

permissions (Array): Mảng chứa các object quyền cần được cấp

role (String): Tên quyền cần được cấp 'name' | 'location' | 'deviceName' | 'email' | 'phone',...

_Request:_
```python
    getUserConsents({
        'permissions': [
            {
                'role': 'String', # Ex: 'name'
            },
            {
                'role': 'String' # Ex: 'email'
            },
            {
                'role': 'String', # Ex: 'phone'
            },
        ]
    }, (data) => {
        console.log(data)
    })
```
_Response:_
```python
    # status = 1: Data trả về một object các trường đã được cấp quyền
    # status = -1: Không được cấp quyền

    # Success
    {                                      # Object
        status: 1,                         # String
        message: 'Hiển thị câu thông báo', # String
        data {                             # Object
            name: 'Hello World';           # String
            phone: '0987654321';           # String
        }
    }

    # Fail
    {                                      # Object
        status: -1,                        # String
        message: 'Hiển thị câu thông báo', # String
        data: {}                           # Object
    }
```

### <em>getUserAuth</em>
*Cập nhật ở phiên bản tiếp theo...*

Lấy thông tin xác thực của người dùng

_Request:_
```python
```
_Response:_
```python
```
### <em>getKeys()</em>
*Cập nhật ở phiên bản tiếp theo...*

Lấy keyCode

_Request:_
```python
```
_Response:_
```python
```
### <em>getLocale()</em>  
*Cập nhật ở phiên bản tiếp theo...*

Lấy ngôn ngữ thiết bị

_Request:_
```python
```
_Response:_
```python
```
### <em>getNetType()</em>
*Cập nhật ở phiên bản tiếp theo...*

Lấy được loại Netword (Lan/Wifi)

_Request:_
```python
```
_Response:_
```python
```
### <em>getCurrentRoute()</em>
*Cập nhật ở phiên bản tiếp theo...*

Lấy được đường dẫn hiện tại

_Request:_
```python
```
_Response:_
```python
```
### <em>getScreenSize()</em>
*Cập nhật ở phiên bản tiếp theo...*

Lấy kích thước màn hình thiết bị

_Request:_
```python
```
_Response:_
```python
```
### <em>openDeeplink(url)</em>
*Cập nhật ở phiên bản tiếp theo...*

Nhập vào một url sẽ gọi đến một nội dung đã được định nghĩa sẵn

_Request:_
```python
```
_Response:_
```python
```
### <em>routeBack()</em>
*Cập nhật ở phiên bản tiếp theo...*

Quay lại router trước đó

_Request:_
```python
```
_Response:_
```python
```
### <em>isShowed()</em>
*Cập nhật ở phiên bản tiếp theo...*

Kiểm tra đã được hiển thị hay chưa

_Request:_
```python
```
_Response:_
```python
```
### <em>getPlayerDuration()</em>
*Cập nhật ở phiên bản tiếp theo...*

Lấy tổng thời lượng nội dung

_Request:_
```python
```
_Response:_
```python
```
### <em>getPlayerCurrentTime()</em>
*Cập nhật ở phiên bản tiếp theo...*

Lấy thời gian hiện tại

_Request:_
```python
```
_Response:_
```python
```
### <em>setPlayerCurrentTime</em>
*Cập nhật ở phiên bản tiếp theo...*

Call tới thời gian muốn play

_Request:_
```python
```
_Response:_
```python
```
### <em>pausePlayer()</em>
*Cập nhật ở phiên bản tiếp theo...*

Stop Player

_Request:_
```python
```
_Response:_
```python
```
### <em>playPlayer</em>
*Cập nhật ở phiên bản tiếp theo...*

Play Player

_Request:_
```python
```
_Response:_
```python
```
### <em>isPlayerPaused()</em>
*Cập nhật ở phiên bản tiếp theo...*

Kiểm tra trạng thái có dừng hay không 

_Request:_
```python
```
_Response:_
```python
```
### <em>isPlayerSeeking()</em>
*Cập nhật ở phiên bản tiếp theo...*

Kiểm tra trạng thái tua nội dung 

_Request:_
```python
```
_Response:_
```python
```
### <em>stashPlayer()</em>
*Cập nhật ở phiên bản tiếp theo...*

Lưu lại thời gian player đang play trước khi chuyển route

_Request:_
```python
```
_Response:_
```python
```
### <em>restorePlayer()</em>
*Cập nhật ở phiên bản tiếp theo...*

Quay lại thời gian player đang play sau khi chuyển sang route khác

_Request:_
```python
```
_Response:_
```python
```
### <em>show()</em>
*Cập nhật ở phiên bản tiếp theo...*

Hiển thị một hành động

_Request:_
```python
```
_Response:_
```python
```
### <em>hide()</em>
*Cập nhật ở phiên bản tiếp theo...*

Ẩn đi một hành động

_Request:_
```python
```
_Response:_
```python
```
### <em>destroy()</em>
*Cập nhật ở phiên bản tiếp theo...*

Hủy bỏ một hành động

_Request:_
```python
```
_Response:_
```python
```
### <em>showAlert()</em>
*Cập nhật ở phiên bản tiếp theo...*

Hiển thị popup cho user thực hiện tiếp hành động

_Request:_
```python
```
_Response:_
```python
```
### <em>showMessage()</em>
*Cập nhật ở phiên bản tiếp theo...*

Hiển thị label thông báo cho user

_Request:_
```python
```
_Response:_
```python
```
### <em>showMenu()</em>
*Cập nhật ở phiên bản tiếp theo...*

Hiển thị Menu

_Request:_
```python
```
_Response:_
```python
```

## Build Setup

```bash
    # install dependencies
    npm run build

    # serve with hot reload at localhost:8282
    npm run dev

    # build for production with minification
    npm run build
```


## License
[FPL](https://fptplay.vn/)
