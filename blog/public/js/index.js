$(function(){
	var html ='';
	$.ajax({
			url:'https://api.douban.com/v2/book/25862578',
			type:'POST',
			dataType:'jsonp',
			success:function(data){
				html += '<li>';
				html += '<img src="'+ data.image +'"/>';
				html += '<h2>'+data.title+'</h2>'
				html += '<li>';
				$('.book-list').append(html);
			}
			
	})
})
