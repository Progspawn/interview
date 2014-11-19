(function() {
	//create angular app module
	var app = angular.module('contactList', ['ui.bootstrap']);

	//controller for gathering and manipulating the contacts
	app.controller('ContactListController', ['$http', '$log', function($http, $log){
		var store = this;
	
		//array to be filled with json data
		store.contacts = [];
		//variable to use when attempting to save new json data
		//compares against pre-edited data to make sure no changes were made between
		//updates
		store.testJSON = {};
		
		//bool to check if the json has been modified remotely
		store.jsonModified = false;
		
		//variable to store new contact data before inserting it into the array
		store.newContact = {};
	
		//get json data
		$http.get('contacts.json').success(function(data){
			//store data in contacts array
			store.contacts = data;
			//get string of current json data to test against later
			store.testJSON = JSON.stringify(store.contacts);
			}).
			error(function(response){
				$log.error(response)
			});
		
		//function to edit an existing contact
		store.editContact = function(contact, editContact){
			//get the index of the contact we are editing
			var index = store.contacts.indexOf(contact)
			//replace the object at that index with our edited object
			store.contacts[index] = editContact;
			//save json data
			store.saveContacts();
		};
		
		//function to delete a contact
		store.deleteContact = function(contact){
			//get the index of the contact to delete
			var index = store.contacts.indexOf(contact);
			//delete contact
			store.contacts.splice(index, 1);
			//save json data
			store.saveContacts();
		};
		
		//function to add contact
		store.addContact = function(){
			//push the new contact into the array
			store.contacts.push(store.newContact);
			//post the array to the json file
			store.saveContacts();	
			//reset newContact
			store.newContact = {};
		};
		
		//function called whenever the contacts are changed and saved
		store.updateContacts = function(string, contact, editContact){
			var test = [];
			$http.get('contacts.json').success(function(data){
				//get the current json data
				test = data;
				//if json data doesn't match the unedited data from earlier
				//don't save it
				if(JSON.stringify(test) !== store.testJSON){
					$log.error("JSON data changed remotely");
					store.jsonModified = true;
					return;
				}
				//run the requested method
				if(string === "delete")
					store.deleteContact(contact);
				if(string === "edit")
					store.editContact(contact, editContact);
				if(string === "add")
					store.addContact();
				}).
			error(function(response){
				$log.error(response);
				return;
			});	
		};
		
		//function to post the json data to the node.js server
		store.saveContacts = function(){
			//convert contacts array to json
			dataObj = angular.toJson(store.contacts, true);
			
			//post to node.js server
			$http.post('http://localhost:8124/', dataObj).success(function(status, response){
			}).
			error(function(response){
				$log.error(response);
			});
		};
	}]);
	
	//controller for editing a contact
	app.controller('EditController', function(){
		//used to prevent adding or deleting a contact when one is being edited
		this.editing = false;
		//variable to store edited contact data before being saved
		this.editContact = {};
		
		//get the contact data to be modified
		this.setEditContact = function(contact){
			this.editing = true;
			angular.copy(contact, this.editContact);
		};
		
		//cancel editing
		this.cancelEdit = function(){
			this.editing = false;
			this.editContact = {};
		};
	});
})();


