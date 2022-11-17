// ------------------------------
// on load
$(document).ready(function () { });

// ------------------------------
function build_select_field_type() {
	let arr = [];
	arr.push("<div class='col-3'>");
	arr.push("<select class='form-select template-field form-control' name='type'>");
	arr.push("<option selected>Select Field Type</option>");
	arr.push("<option value='string'>String</option>");
	arr.push("<option value='bool'>Bool</option>");
	arr.push("<option value='datetime'>Date Time</option>");
	arr.push("<option value='number'>Number</option>");
	arr.push("</select>");
	arr.push("</div>");
	return arr.join("");
}

// ------------------------------
// add row with input fields
function delete_row(element) {

	console.log('delete row');
	$(element).parent().parent().remove();
};

// ------------------------------
// add row with input fields
$("#add_field").on("click", function (e) {
	e.preventDefault();

	let arr = [];

	// create html input fields
	arr.push('<div class="row form-group" style="margin-bottom: 10px; margin-top: 10px; ">');
	arr.push(
		'<div class="col-3"><input type="text" class="form-control template-field" placeholder="Field Name" name="name"/></div>'
	);
	arr.push(
		'<div class="col-3"><input type="text" class="form-control template-field" placeholder="Description" name="description"/></div>'
	);
	arr.push(build_select_field_type());
	arr.push(
		'<div class="col-3"><button class="btn btn-danger" onclick="delete_row(this); return false;"><i class="fa-solid fa-trash"></i></button></div>'
	);
	arr.push("</div>");

	$("#show_fields").append($(arr.join("")));
});

// ------------------------------
// send data to server
// request: auth_token, JSON ["data": {"credential_template_title":"", "credential_template_fields":[{"name":"", "type":"", "description": ""}]}
function send_data_to_server(field_data) {
	let data = {};

	data['auth_token'] = "CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEmAKKnVybjp0cmluc2ljOndhbGxldHM6TmFBUVpvN3FDWWdrMk45TExta1RUQiIydXJuOnRyaW5zaWM6ZWNvc3lzdGVtczp2aWdvcm91cy1rZWxsZXItRllSR2ZkRVdaWHQaMJK76tJBHrph2GiNhsBiS6oH7YbkvoF7ESrWLjKxiPy8rZFyxrBO8ZyHqBwxdPYA1CIA"

	// acquire credential titile
	data['credential_template_title'] = $("#credential_title").val();

	data['credential_template_fields'] = JSON.stringify(field_data);

	// send authtoken, fields and title to server
	$.ajax({
		dataType: 'json',
		data: data,
		url: " http://939c-105-186-161-154.ngrok.io/createCredentialTemplate",
		method: "POST",
		type: "POST",
		success: function (result) {
			console.log(result);
		},
	});

	// $.ajax({
	// 	dataType: 'jsonp',
	// 	url: ` http://939c-105-186-161-154.ngrok.io/createCredentialTemplate/${data['auth_token']}/${data['credential_template_title']}/${data['credential_template_fields']}`,
	// 	type: "GET",
	// 	contentType: "application/json",
	// 	success: function (result) {
	// 		console.log(result);
	// 	},
	// });
}

// ------------------------------
$("#show_fields").submit(function (e) {
	e.preventDefault();
	const arr = transform_rows_to_object($(this).serializeArray());
	send_data_to_server(arr);
});

// ------------------------------
function transform_rows_to_object(arr) {
	// group three rows and create row object
	let count = 0;
	let new_obj = {}
	let new_obj_arr = []

	arr.forEach(element => {

		new_obj[element.name] = element.value;

		if (count >= 2) {
			count = 0;
			new_obj_arr.push(new_obj);
			new_obj = {};
			return;
		}

		count++;

	});

	return new_obj_arr;
}

// ------------------------------
// [x] display input fields
// [x] get input field data
// confirmation dialog popup
// field validation
// dropdown selected validation