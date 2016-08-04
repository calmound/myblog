$(function(){
	$(".ans-btn").click(function(){
		var toId = $(this).data('fid');
		var commentId = $(this).data('cid');
		
		//给谁回复的
		if($('#toId').length > 0){
			$('#toId').val(toId);
		}else{
			$('<input>').attr({
				type:'hidden',
				name:'comment[tid]',
				value:toId,
				id:'toId'
			}).appendTo($('#commentForm'));
		}
		
		
		if($('#commentId').length > 0){
			$('#commentId').val(toId);
		}else{
			$('<input>').attr({
				type:'hidden',
				name:'comment[cid]',
				value:commentId,
				id:'commentId'
			}).appendTo($('#commentForm'));
		}
	});
});
