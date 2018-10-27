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

      _populateMajors();
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

      // ------------------------------
      // File upload
      var CV = document.getElementById('CV');  //$('#CV.ui');
      CV.addEventListener("change", handleFiles, false);

      function handleFiles() {
	    var fileList = this.files; /* now you can work with the file list */

	    if (!fileList){
		return;	    
            }else{
	       sweetAlert("Success", "You are about to upload a file"+fileList, "success");
	       $http.post('/someUrl', data, config).then(successCallback, errorCallback);

		    //<<<<<<< --------- HERE 
      	    }
      }



      // -------------------------------
      /// Contextual Majors
      function _populateMajors(){
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
      
      /* function _sendUploadToGCS(req, res, next) {
 	     if (!req.file) {
    		return next();
 	     }
	      
             const gcsname = $scope.fileName;
             const file = bucket.file(gcsname);
             const stream = file.createWriteStream({
                metadata: {
                   contentType: req.file.mimetype
                },
                resumable: false
            });

            stream.on('error', (err) => {
                req.file.cloudStorageError = err;
                next(err);
            });

            stream.on('finish', () => {
                req.file.cloudStorageObject = gcsname;
                //file.makePublic().then(() => {
                //req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
                next();
                //});
            });
            stream.end(req.file.buffer);
         } */


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

      $scope.uploadCV = function(){
	  
	 sweetAlert("Success", "You are about to upload a file", "success");
      }

    }]);
