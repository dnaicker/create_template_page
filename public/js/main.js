const ngrok_url = "http://2fd6-2001-4200-7000-9-5db-c11b-2268-da25.ngrok.io";
const auth_token = "CiVodHRwczovL3RyaW5zaWMuaWQvc2VjdXJpdHkvdjEvb2Jlcm9uEkkKKnVybjp0cmluc2ljOndhbGxldHM6N1VwRmtIUEdvektWUWNFSHVLYVZ3TSIbdXJuOnRyaW5zaWM6ZWNvc3lzdGVtczpDU0lSGjCTwP0t3e2BdAKnkSjJIJN1HMwlexAmvYBUGBzR_DEFkGZebj-IdHu48JKhMrjBdegiAA"

// ------------------------------
// on load
$(document).ready(function () {
	$("#modal_load").load("modal.html");
});

// ------------------------------
const UUIDv4 = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) }

// ------------------------------
function build_optional_field_selection() {
	let arr = [];
	const random = UUIDv4();
	arr.push('<div class="col-md-2" id="optional_' + UUIDv4() + '">');
	arr.push('<div class="form-check">');
	arr.push('<input class="form-check-input template-field" type="radio" name="optional_' + random + '" value="true" >');
	arr.push('<label class="form-check-label" >');
	arr.push('Optional');
	arr.push('</label>');
	arr.push('</div>');
	arr.push('<div class="form-check">');
	arr.push('<input class="form-check-input template-field" type="radio" name="optional_' + random + '" value="false" checked>');
	arr.push('<label class="form-check-label" >');
	arr.push('Mandatory');
	arr.push('</label>');
	arr.push('</div>');
	arr.push('</div>');
	return arr.join("");
}

// ------------------------------
function build_select_field_type() {
	let arr = [];
	arr.push("<div class='col-md-2'>");
	arr.push("<select class='form-select template-field form-control' name='type' required >");
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

	show_confirmation_modal('Delete Row', 'Are you sure you want to delete this row?', function () {
		console.log('delete row');
		$(element).parent().parent().remove();
	});
};

// ------------------------------
// add row with input fields
$("#add_field").on("click", function (e) {
	e.preventDefault();

	let arr = [];

	// create html input fields
	arr.push('<div class="row form-group" style="margin-bottom: 10px; margin-top: 25px; ">');
	arr.push(
		'<div class="col-md-3"><input required type="text" class="form-control template-field" placeholder="Field Name" name="name"></input></div>'
	);
	arr.push(
		'<div class="col-md-3"><input required type="text" class="form-control template-field" placeholder="Description" name="description"/></input></div>'
	);

	arr.push(build_select_field_type());
	arr.push(build_optional_field_selection());

	arr.push(
		'<div class="col-md-1"><button class="btn btn-block btn-danger" style="width: 100%" onclick="delete_row(this); return false;"><i class="fa-solid fa-trash"></i></button></div>'
	);
	arr.push("</div>");

	$("#show_fields").append($(arr.join("")));
});

// ------------------------------
// send data to server
// request: auth_token, JSON ["data": {"credential_template_title":"", "credential_template_fields":[{"name":"", "type":"", "description": ""}]}
function send_data_to_server(field_data) {
	let data = {};

	data['auth_token'] = auth_token;

	// acquire credential titile
	data['credential_template_title'] = $("#credential_title").val();

	data['credential_template_fields'] = JSON.stringify(field_data);

	console.log(field_data);

	// send authtoken, fields and title to server
	$.ajax({
		dataType: 'json',
		data: data,
		url: `${ngrok_url}/createCredentialTemplate`,
		type: "POST",
		success: function (result) {
			console.log(result);
			show_modal('Success', '<b>' + result.name + '</b> was created successfully');
		},
	});
}

// ------------------------------
$("#show_fields").submit(function (e) {
	e.preventDefault();
	const arr = transform_rows_to_object($(this).serializeArray());
	if (validate_form()) {
		send_data_to_server(arr);
	}
});

// ------------------------------
// validate if input fields have values
function validate_form() {
	const credential_template_form = document.getElementById('show_fields')
	credential_template_form.classList.add('was-validated');
	const title_valid = $("#credential_title").val().length > 0 ? true : false;
	const input_fields_valid = $("#show_fields").serializeArray().length > 0 ? true : false;

	if (title_valid === false) {
		show_modal('Error', 'Please enter a title for the credential template');
		return false;
	} else if (input_fields_valid === false) {
		show_modal('Error', 'Please add at least one field');
		return false;
	} else if (credential_template_form.checkValidity() === false) {
		show_modal('Error', 'Please complete filling in all input fields');
		return false;
	}

	return true;
}

// ------------------------------
function transform_rows_to_object(arr) {
	// group three rows and create row object
	let count = 0;
	let new_obj = {}
	let new_obj_arr = []

	arr.forEach(element => {


		// replace optional uuid4 with optional
		if (element.name.search(/optional_/) === 0) {
			new_obj["optional"] = element.value;
		}
		else if (count == 0) {
			// for field names concatenate and camel case value

			// break string into array of words
			let words = element.value.split(" ");

			// capitalize first letter of each word
			let words_camel_case = words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1));

			let words_combined = []; 
			
			new_obj[element.name] = words_combined.concat(words[0], words_camel_case).join("");
		} 
		else {
			// store normal field value
			new_obj[element.name] = element.value;
		}

		// add row contents into one object for fieldName, fieldDescription, fieldType, fieldOptional
		if (count >= 3) {
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
function show_modal(header, body) {
	$("#modal_header")[0].innerHTML = header;
	$("#modal_body")[0].innerHTML = "<p>" + body + "</p>";
	$("#modal").modal('show');
}

// ------------------------------
function show_confirmation_modal(header, body, confirm_callback) {
	$("#confirmation_modal_header")[0].innerHTML = header;
	$("#confirmation_modal_body")[0].innerHTML = "<p>" + body + "</p>";
	$("#confirmation_modal").modal('show');
	$("#modal_button_confirm").on("click", function (e) {
		confirm_callback();
		$("#confirmation_modal").modal('hide');
	});
}

// ------------------------------
// [x] display input fields
// [x] get input field data
// confirmation dialog popup
// field validation
// dropdown selected validation