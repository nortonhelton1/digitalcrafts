
const submitbtn = document.getElementById("submitbtn")
const tasklist = document.getElementById("tasklist")
const prioritymenu = document.getElementById("priority-dropdown")

let priority = "low"

prioritymenu.addEventListener("change", function (e) {
	if (this.value == "low"){
		priority = "low"
	}else if (this.value == "medium") {
		priority = "medium"
	}else if (this.value == "high") {
		priority = "high"
	}
})

let currentdate = new Date();

submitbtn.addEventListener("click",function () {
	const taskname = document.getElementById("taskname")
	
	fetch("http://localhost:3000/todos", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			title: taskname.value,
			date: `${(currentdate.getMonth()+1)}/${currentdate.getDate()}/${currentdate.getFullYear()}`,
			priority: priority
		})
	}).then(response => response.json())
		.then(result => listAllTasks())
})

function listAllTasks() {
	fetch('http://localhost:3000/todos')
	.then(response => response.json())
	.then(tasks => {
		
		const taskItems = tasks.map((task) => {
			return `<li>${task.title} - ${task.date}</li>`
		})
		
		tasklist.innerHTML = taskItems.join("")
	})
}

listAllTasks()