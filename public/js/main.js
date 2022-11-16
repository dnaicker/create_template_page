// ------------------------------
// on load
$(document).ready(function () { });

// ------------------------------
function build_select_field_type() {
	let arr = [];
	arr.push("<div class='col'>");
	arr.push("<select class='form-select template-field form-control' name='type'>");
	arr.push("<option selected>Select field type</option>");
	arr.push("<option value='string'>string</option>");
	arr.push("<option value='bool'>bool</option>");
	arr.push("<option value='datetime'>datetime</option>");
	arr.push("<option value='number'>number</option>");
	arr.push("</select>");
	arr.push("</div>");
	return arr.join("");
}

// ------------------------------
function build_dropdown_field_type() {
	let arr = [];
	arr.push("<div class='col'>");
	arr.push('<div class="dropdown">');
	arr.push(
		'<button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">'
	);
	arr.push("Select field type");
	arr.push("</button>");
	arr.push('<div class="dropdown-menu">');
	arr.push('<a class="dropdown-item">String</a>');
	arr.push('<a class="dropdown-item">Bool</a>');
	arr.push('<a class="dropdown-item">Number</a>');
	arr.push('<a class="dropdown-item">Date Time</a>');
	arr.push("</div>");
	arr.push("</div>");
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
		'<div class="col"><input type="text" class="form-control template-field" placeholder="Field Name" name="name"/></div>'
	);
	arr.push(
		'<div class="col"><input type="text" class="form-control template-field" placeholder="Description" name="description"/></div>'
	);
	arr.push(build_select_field_type());
	arr.push(
		'<div class="col"><button class="btn btn-danger" onclick="delete_row(this); return false;"><i class="fa-solid fa-trash"></i></button></div>'
	);
	arr.push("</div>");

	$("#show_fields").append($(arr.join("")));
});

// ------------------------------
$("#show_fields").submit(function (e) {
	e.preventDefault();
	console.log($(this).serializeArray());
	const arr = transform_rows_to_object($(this).serializeArray());


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

	console.log(new_obj_arr);
	return new_obj_arr;
}

// ------------------------------
// [x] display input fields
// get input field data
// confirmation dialog popup