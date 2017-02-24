var prepage = 5;
var page = 1;
var pages = 0;
var comments = [];

//提交评论
$('#messageBtn').on('click',function(){

   if($('#messageContent').val() === ''){
       return;
   };

   $.ajax({
       type:'POST',
       url:'/api/comment/post',
       data:{
           contentid:$('#contentId').val(),
           content:$('#messageContent').val()
       },
       success:function(responseData){
           $('#messageContent').val('');
           comments = responseData.data.comments.reverse();
           renderComment();
       }
   });
});

//每次页面重载，获取该文章的所有评论
$.ajax({
    url:'/api/comment',
    data:{
        contentid:$('#contentId').val()
    },
    success:function(responseData){
        comments = responseData.data.reverse();
        renderComment();
    }
});

$('.pager').delegate('a','click',function(){
    if($(this).parent().hasClass('previous')){
        page--;
    }else{
        page++;
    }
    renderComment();
});

//渲染评论列表
function renderComment(){

    $('#messageCount').html(comments.length);

    pages = Math.max(1,Math.ceil(comments.length / prepage));
    var start = Math.max((0,page-1) * prepage);
    var end = Math.min(start + prepage,comments.length);

    var $lis = $('.pager li');
    $lis.eq(1).html(page + ' /  ' + pages);

    if(page <= 1){
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>');
    }else{
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if(page >= pages){
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    }else{
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if(comments.length == 0){
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
    }else{
        var html = '';
        for(var i=start;i<end;i++){
            html += '<div class="messageBox" style="background-color:#f9f9f9;">'+
                '<p class="name clear" style="border-bottom:none;"><span class="fl">'+comments[i].username+' 说：</span><span class="fr" style="font-style:italic;color:#999;">'+formatDate(comments[i].postTime)+'</span></p><p>" '+comments[i].content+' "</p>'+
                '</div>';
        }
        $('.messageList').html(html);
    }


}

//格式化时间
function formatDate(d){
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + toDouble(date1.getMonth()+1) + '月' + toDouble(date1.getDate()) + '日 ' + toDouble(date1.getHours()) + ':' + toDouble(date1.getMinutes()) + ':' + toDouble(date1.getSeconds());
}

//补零
function toDouble(n){
    return n < 10 ? '0' + n : '' + n;
}
