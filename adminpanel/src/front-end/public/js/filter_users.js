function filter() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("filter_input");
  filter = input.value.toUpperCase();
  table = document.getElementById("users_table");
  tr = table.getElementsByTagName("tr");

	let string = "";
  for (i = 1; i < tr.length; i++) {
		string = "";
		for (let index = 0; index < 3; index++) {
			const td = tr[i].getElementsByTagName("td")[index];
			if (td) {
				txtValue = td.textContent || td.innerText;
				string += txtValue;
			}
		}
		console.log(string);
    if (string.toUpperCase().indexOf(filter) > -1) {
			tr[i].style.display = "";
		} else {
			tr[i].style.display = "none";
		}
  }
}