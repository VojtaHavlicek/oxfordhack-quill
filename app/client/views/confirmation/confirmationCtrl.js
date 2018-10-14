angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state', 
    '$http',
    'currentUser',
    'Utils',
    'Session',
    'UserService',
    function($scope, $rootScope, $state, $http, currentUser, Utils, Session, UserService){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;
      $scope.pastConfirmation = Date.now() > user.status.confirmBy;
      $scope.formatTime = Utils.formatTime;

      populateMajors();
      _setupForm();
	    
      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

      // -------------------------------
      // All this just for dietary restriction checkboxes fml
      var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
        'Halal': false,
        'Kosher': false,
        'Nut Allergy': false
      };

      if (user.confirmation.dietaryRestrictions){
        user.confirmation.dietaryRestrictions.forEach(function(restriction){
          if (restriction in dietaryRestrictions){
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      // -------------------------------
      function populateMajors(){
	      $http
	         .get('/assets/majors.csv')
	         .then(function(res){
			 $scope.majors = res.data.split('\n');
			 $scope.majors.push('Other');

			 var content = [];

			 for(i = 0; i < $scope.majors.length; i++) {
				 $scope.majors[i] = $scope.majors[i].trim();
				 content.push({title: $scope.majors[i]});
			 }

			 $('#major.ui.search')
			   .search({
				   source: content,
				   cache:true,
				   onSelect: function(result, response) {
					   $scope.user.confirmation.major = result.title.trim();
				   }
			   })
		 });
      }

      function _updateUser(e){
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function(key){
          if ($scope.dietaryRestrictions[key]){
            drs.push(key);
          }
        });
        confirmation.dietaryRestrictions = drs;

        UserService
          .updateConfirmation(user._id, confirmation)
          .success(function(data){
            sweetAlert({
              title: "Great!",
              text: "You're confirmed!",
              type: "success",
              confirmButtonColor: "#002147"
            }, function(){
              $state.go('app.dashboard');
            });
          })
          .error(function(res){
            sweetAlert("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please give us a shirt size!'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a phone number.'
                }
              ]
            },
            signature: {
              identifier: 'signature',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            checkboxMLH: {
	      identifier: 'checkboxMLH',
	      rules: [
		{
		   type: 'checkboxMLH',
	           prompt: 'Please agree to share your data with MLH. Please understand that passing your data to sponsors and MLH helps us to make this event happen.'
		}
	      ]
	    }
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        }else{
	  sweetAlert("Error","Please fill the required fields","error");
	}
      };

    }]);
