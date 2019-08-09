// 主要是用于操作用户的 
var userArr = new Array();
// 将用户列表展示出来 
$.ajax({
    type: 'get',
    url: '/users',
    success: function (res) {
        userArr = res;
        render(userArr);
    }
})

// 用于调用template方法 
function render(arr) {
    var str = template('userTpl', {
        list: arr
    });
    // console.log(str)
    $('tbody').html(str);
}

$('#userAdd').on('click', function () {
    // console.log($('#userForm').serialize());
    // return;

    $.ajax({
        url: '/users',
        type: 'post',
        data: $('#userForm').serialize(),
        success: function (res) {
            userArr.push(res);
            render(userArr);
        }
    })
})

//上传图片
$("#avatar").on('change', function () {
    var formData = new FormData();
    formData.append('avatar', this.files[0]);

    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            $("#preview").attr('src', response[0].avatar);
            $("#hiddenAvatar").val(response[0].avatar);
        }

    })
})
var userId;
$('tbody').on('click', '.edit', function () {
    userId = $(this).parent().attr('data-id');
    $('#userForm > h2').text('修改用户');
    var trObj = $(this).parents('tr');
    var imgSrc = trObj.children(1).children('img').attr('src');
    $('#hiddenAvatar').val(imgSrc);
    if (imgSrc) {
        $('#preview').attr('src', imgSrc)
    } else {
        $('#preview').attr('src', "../assets/img/default.png");
    }
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());

    var status = trObj.children().eq(4).text();
    if (status == '激活') {
        $('#jh').prop('checked', true);
    } else {
        $('#wjh').prop('checked', true);
    }

    var role = trObj.children().eq(5).text();
    // console.log(role)
    if (role == '超级管理员') {
        $('#admin').prop('checked', true);
    } else {
        $('#normal').prop('checked', true);
    }
    $('#userAdd').hide();
    $('#userEdit').show();
});
$('#userEdit').on('click', function () {
    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: $('#userForm').serialize(),
        success: function (res) {
            var index = userArr.findIndex(item => item._id == userId);
            suerArr[index] = res;
            render(userArr);
        }
    });
});