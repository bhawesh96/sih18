$(document).ready(function(){

	$('#submit').click(function(){
		alert('click');
		var name = $('#name').val();
		var email = $('#email').val();
		var phone = $('#phone').val();
		var whyAttend = $('#whyAttend').val();
		var whatTake = $('#whatTake').val();
		var favSpeaker = $('#favSpeaker').val();
		var excited = $('#excited').val();
		var contribution = $('#contribution').val();
		$.post("php/signup.php", {name:name, email:email, phone:phone, whyAttend:whyAttend, whatTake:whatTake, 
			favSpeaker:favSpeaker, excited:excited, contribution:contribution}, function(data){
				
				});
	});

	$('.acceptbutton').click(function(){
		$('.acceptbutton').hide();
		$('.tnc').hide(100);
		$('.form').show(200);
		$('html, body').animate({scrollTop : 0},300);

	});
});
