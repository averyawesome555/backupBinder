App = new Vue({
	el: "body",
	data: {
		binder: [
			{
				name: "History",
				lastChanged: new Date(),
				starred: false,
				contents: [],
			}
		],
		newFolderName: "",

	}
})