$(document).ready(function() {

var mysql = require('mysql');

// DB connection
// var connection = mysql.createConnection({
// 	host     : 'beehivesoftech.co.in',
// 	port     :  '3306',
// 	user     : 'beehipfc_root',
// 	password : 'randomise',
// 	database : 'beehipfc_sih18'
// })

var connection = mysql.createConnection({
	host     : 'localhost',
	port     :  '3306',
	user     : 'root',
	password : 'password',
	database : 'sihlocal'
})

connection.connect(function(err) {
});

var user;
var total=0;
var sort_count, book_count, deli_count;
var factors = {}

var query = connection.query("SELECT * FROM factors", function(err, res, f) {
	factors = {
		bookf: res[0].bookf,
		sortf: res[0].sortf,
		delif: res[0].delif,
		distf: res[0].distf
	}
	$('#bookf').val(factors.bookf)
	$('#sortf').val(factors.sortf)
	$('#delif').val(factors.delif)
	$('#distf').val(factors.distf)

});

$('#updateFactors').click(function(e) {
	e.preventDefault();
	var queryStr = "UPDATE factors SET bookf='" +$('#bookf').val()+"',sortf='"+$('#sortf').val()+"',delif='"+$('#delif').val()+"',distf='"+$('#distf').val()+"'";
	console.log(queryStr);
	var query = connection.query(queryStr)
})

var slat=slon=dlat=dlon=0.0;

// Source pincode
$('#src-pincode').keyup(function() {
	if($('#src-pincode').val().length == 6) {
			var pincode = $('#src-pincode').val();
			var query = connection.query("SELECT * FROM location WHERE PINCODE='"+pincode+"'", function(err, res, fields) {
				console.log(res)
				if(res[0]) {
					$('#src-cityState').val(res[0].CITIES + ', ' + res[0].STATE);
					slat = res[0].LATITUDE;
					slon = res[0].LONGITUDE;
				}
				if(!res[0]) {
					$('#src-cityState').val('INVALID PINCODE');
				}
			});
		}
	else {
		$('#src-cityState').val("");
		slat=slon=0;
	}
});

// Destination pincode
$('#dest-pincode').keyup(function() {
	if($('#dest-pincode').val().length == 6) {
			var pincode = $('#dest-pincode').val();
			var query = connection.query("SELECT * FROM location WHERE PINCODE='"+pincode+"'", function(err, res, fields) {
				console.log(res)
				if(res[0]) {
					$('#dest-cityState').val(res[0].CITIES + ', ' + res[0].STATE);
					dlat = res[0].LATITUDE;
					dlon = res[0].LONGITUDE;
				}
				if(!res[0]) {
					$('#dest-cityState').val('INVALID PINCODE');
				}
			});
		}
	else {
		$('#dest-cityState').val("");
		dlat=dlon=0;
	}
});

// Service type
$('#service-type').change(function() {
	if($('#service-type').val() == 'parcel') {
		$("[id=dimensions]").css("display", "block");
		$('#dimension').attr("readonly", false);
	}
	else {
		$("[id=dimensions]").css("display", "none");
		$('#dimension').attr("readonly", true);
	}
})

// Login form submit
$('#loginSubmit').click(function(e) {
	e.preventDefault();
	var user = $('#username').val();
	var pass = $('#password').val();

	console.log(user);
	console.log(pass);

	var query = connection.query("SELECT * FROM users WHERE username='"+user+"' AND password='"+pass+"'", function(err, res, fields) {
		if(res[0]) {
			if(res[0].username == 'admin') {
				user = 'admin';
				window.location.href="admin.html"
				return;
			}
			window.location.href="home.html"
		}
		if(!res[0]) {
			alert('Incorrect Username & Password combination');
		}
	})
})

$('#calcDistance').click(function(e) {
	e.preventDefault();
	// calcDist(slat, slon, dlat, dlon);
	hop2hop(slat, slon, dlat, dlon);
});

function calcDist(slatx, slonx, dlatx, dlonx) {
	slatx = Math.PI * slatx / 180.0;
	slonx = Math.PI * slonx / 180.0;
	dlatx = Math.PI * dlatx / 180.0;
	dlonx = Math.PI * dlonx / 180.0;

	difflat = slatx - dlatx;
	difflon = slonx - dlonx;


	var a = Math.pow(Math.sin(difflat / 2), 2) + Math.cos(slatx) * Math.cos(dlatx) * Math.pow(Math.sin(difflon / 2), 2);

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var dist = 6373.0*c;

	var buffer_dist = dist*1.15;
	var dist_cost = buffer_dist * factors.distf;
	return (dist_cost);
}

var s_rms_lat, s_rms_lon, s_city, d_rms_lat, d_rms_lon, dist_src_rms, dist_dest_rms, d_city, dist_srms_drms;

function hop2hop(slat, slon, dlat, dlon) {
	// src-rms

	var query = connection.query("SELECT * FROM location NATURAL JOIN rms_nsh WHERE latitude='" +slat+"' AND longitude='" +slon +"'", function(err, res, f) {

		s_rms_lat = res[0].RMS_LATITUDE;
		s_rms_lon = res[0].RMS_LONGITUDE;
		s_city = res[0].CITIES;
		dist_src_rms = calcDist(slat, slon, s_rms_lat, s_rms_lon);

	});

	// dest-rms
	var query = connection.query("SELECT * FROM location NATURAL JOIN rms_nsh WHERE latitude='" +dlat+"' AND longitude='" +dlon +"'", function(err, res, f) {

		d_rms_lat = res[0].RMS_LATITUDE;
		d_rms_lon = res[0].RMS_LONGITUDE;
		d_city = res[0].CITIES;	
		dist_dest_rms = calcDist(dlat, dlon, d_rms_lat, d_rms_lon);
		
		dist_srms_drms = calcDist(s_rms_lat, s_rms_lon, d_rms_lat, d_rms_lon);

		alert(s_city + " to " + s_city + " RMS = " + dist_src_rms + "\n\n" + s_city + " RMS to " + d_city + " RMS = " + dist_srms_drms + "\n\n" + d_city + " RMS to " + d_city + " = " + dist_dest_rms)

	});
}

$('#calcCost').click(function(e) {
	e.preventDefault();
	var cost;
	var type = $('#service-type').val();

	var weight = $('#weight').val();

	var length = $('#length').val();
	var breadth = $('#breadth').val();
	var height = $('#height').val();
	var volume = length*breadth*height;

	if(type == 'bookPacket') {
		cost = 3*(weight/50) + 4;
	}

	if(type == 'parcel') {
		if(weight <= 500) {
			cost = Math.floor((volume/3000)*16) + 19;
		}
		else
			cost = Math.floor((weight/500)*16) + 19;
	}

	if(type == 'letter') {
            cost = Math.ceil(weight*0.05)*5;
	}
	if(type == 'speedPost') {
       if(weight > 200){
       	cost = Math.floor(weight/500)*40 + 80;    
       }  
       else if(weight > 50)
       {
       	cost = 60;
       }
       else cost = 35;
	}

	// console.log(cost);
	alert("Distance cost = " + (dist_src_rms+dist_dest_rms+dist_srms_drms) + "\n\nWeight and Volume cost = " + cost +"\n\nTotal = " + (cost+dist_src_rms+dist_dest_rms+dist_srms_drms));
})

// ==========================================================================================
// ADMIN

if(user == 'admin' || true) {
	var query = connection.query("SELECT DISTINCT empid from BLAH ORDER BY empid DESC", function(err, res, f) {
		for(var x of res) {
			$('#empid').append($('<option>', {
			    value: x.empid,
			    text: x.empid
			}));
		}
	});

	$('#getDetails').click(function(e) {
		e.preventDefault();
		total=0;
		sort_count=book_count=deli_count=0;

		var query = "SELECT count(action) AS total FROM BLAH WHERE action='S' GROUP BY empid HAVING empid='" + $('#empid').val() + "'";
		connection.query(query, function(err, res, f) {
			sort_count = res[0].total || 0;
			total+=parseInt(sort_count)*parseInt(factors.sortf);
		});

		var query = "SELECT count(action) AS total FROM BLAH WHERE action='B' GROUP BY empid HAVING empid='" + $('#empid').val() + "'";
		connection.query(query, function(err, res, f) {
			book_count = res[0].total || 0;
			total+=parseInt(book_count)*parseInt(factors.bookf);
		});

		var query = "SELECT count(action) AS total FROM BLAH WHERE action='D' GROUP BY empid HAVING empid='" + $('#empid').val() + "'";
		connection.query(query, function(err, res, f) {
			deli_count = res[0].total || 0;
			total+=parseInt(deli_count)*parseInt(factors.delif);
		});

		console.log(total);
		setTimeout(function() {
			alert("Bookings: " +book_count+ "\nSortings: " +sort_count+ "\nDeliveries: " +deli_count+ "\n\nTotal Salary: " + total)
		}, 500);
	})
}

}); // end document.ready