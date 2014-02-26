var app = angular.module('listloader.app', []);


app.directive('listLoader', function() {
	return {
		restrict: "A",
		template: "<div class=\"listLoader\" contenteditable></div><div ng-repeat=\"line in lines track by $index\">{{line.text}}</div>",
		scope: {
			action: '&',
		},
		controller: function($scope) { $scope.lines = []; },
		link: function(scope, element, attrs) {


			console.log(scope.action("hi"));
			
			element[0].onkeydown = element[0].onkeypress = function(event) {
				if (event.which === 13) {
					scope.$apply(function() {
						// push a new line object on to lines array
						scope.lines.push({
							text: scope.lineAction(event.srcElement.innerText),
							complete: true,
						});
						// clear the contenteditable div for next entry
						event.srcElement.innerText = '';
						event.preventDefault();					
					});
				}
			}

			// scope.$watch('lines', function(newVal, oldVal) { }, true);
		}
	}
})

app.controller('listloader.ctrl', function($scope) {
	$scope.myAction = function(line) {
		return "LINE: " + line;
	}
})