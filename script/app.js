/**
 * Created by Dipesh on 11/19/14.
 * Features:
 *      1) View contacts
 *      2) Search contacts
 *      3) Sort contacts when viewing
 *      4) Add contacts
 *      5) Edit contacts
 *      6) Delete contacts
 *
 */

var contactApp = angular.module("contactApp", ['ngRoute','ngCookies']);
contactApp.config(function ($routeProvider) {
    $routeProvider
        .when('/ShowAll',
        {
            controller: 'ShowCtrl',
            templateUrl: './Partials/search.html'
        })
        .when('/Add',
        {
            controller: 'AddCtrl',
            templateUrl: './Partials/add.html'
        })
        .when('/Edit/:sno',
        {
            controller: 'EditCtrl',
            templateUrl: './Partials/edit.html'
        })
        .otherwise({redirectTo: '/ShowAll'})
});

var controllers = {}


controllers.ShowCtrl = function($scope, $cookieStore){
    // look into cookie first,
    // if it's not found then create a dummy
    var contactList = $cookieStore.get('contactList');

    if(contactList == null) {
        $scope.contactList = [
            {sno: 1, firstName: 'Dipesh', lastName: 'Shrestha', address: 'Kathmandu', telephone: '1234567890'},
            {sno: 2, firstName: 'John', lastName: 'Smith', address: 'Pokhara', telephone: '2234567890'},
            {sno: 3, firstName: 'Mary', lastName: 'Com', address: 'Bharatpur', telephone: '3234567890'}
        ];
        // put list into cookie
        $cookieStore.put('contactList', $scope.contactList);

        // next S.No. is generated from this when new contact is added
        $cookieStore.put('nextSno', '4');

    }else {
        $scope.contactList = contactList;
    }

    // default sort field
    $scope.orderByField = 'sno';
    $scope.isOrderReverse = false;

    /**
     * Sort contacts
     * @param orderByField
     */
    $scope.sort = function(orderByField) {

        // update the sort icon
        if(orderByField == $scope.orderByField) {
            // change the order
            $scope.isOrderReverse = !$scope.isOrderReverse;
        }else{
            // use default order
            $scope.isOrderReverse = false;
        }

        // update the sort icon
        var oldSortField = "#sortBy-" + $scope.orderByField;
        $(oldSortField).removeClass("glyphicon-sort-by-attributes");
        $(oldSortField).removeClass("glyphicon-sort-by-attributes-alt");

        var newSortField = "#sortBy-" + orderByField;
        var newSortClass = "glyphicon-sort-by-attributes" + (($scope.isOrderReverse) ? "-alt" : "");
        $(newSortField).addClass(newSortClass);

        $scope.orderByField = orderByField;
    }

    /**
     * Delete the contact from list using sno
     * @param sno
     */
    $scope.deleteContact = function(sno) {

        for (var index in $scope.contactList) {
            var deleteSno = $scope.contactList[index].sno;
            if(sno == deleteSno) {
                $scope.contactList.splice(index,1);
                break;
            }
        }
        // put new list into cookie
        $cookieStore.put('contactList', $scope.contactList);
    }

    /**
     * Reset the form used to search
     */
    $scope.reset = function() {
        $scope.filter.firstName = "";
        $scope.filter.lastName = "";
        $scope.filter.telephone = "";
    }

};

controllers.AddCtrl = function($scope,  $window, $cookieStore){

    /**
     * Add new contact
     */
    $scope.addContact = function() {
        // add new contact
        var contactList = $cookieStore.get('contactList');
        contactList.push(
            {
                sno:           $cookieStore.get('nextSno'),
                firstName:     $scope.newContact.firstName,
                lastName:     $scope.newContact.lastName,
                address:      $scope.newContact.address,
                telephone:    $scope.newContact.telephone
            });

        // store into cookie
        $cookieStore.put('contactList', contactList);
        $cookieStore.put('nextSno', parseInt($cookieStore.get('nextSno')) + 1);

        // redirect to ShowAll page
        $window.location.href= "#ShowAll";
    }

    /**
     *  Redirect to ShowAll page
     */
    $scope.showAll = function () {
        $window.location.href= "#ShowAll";
    }

};

controllers.EditCtrl = function($scope,  $window, $cookieStore, $routeParams) {

    /**
     * TODO: doesn't seem to work if $scope.xxx.sno format is used for the edit values;
     */
    var contactList = $cookieStore.get('contactList');

    for (var index in contactList) {
        var editSno = contactList[index].sno;
        if ($routeParams.sno == editSno) {
            $scope.sno = contactList[index].sno;
            $scope.firstName = contactList[index].firstName;
            $scope.lastName = contactList[index].lastName;
            $scope.address = contactList[index].address;
            $scope.telephone = contactList[index].telephone;
        }
    }


    /**
     *  Edit Contact
     */
    $scope.editContact = function (sno) {

        for (var index in contactList) {
            var editSno = contactList[index].sno;
            if ($routeParams.sno == editSno) {
                contactList.splice(index, 1,
                    {
                        sno: $scope.sno,
                        firstName: $scope.firstName,
                        lastName: $scope.lastName,
                        address: $scope.address,
                        telephone: $scope.telephone
                    });
            }
        }

        // store into cookie
        $cookieStore.put('contactList', contactList);

        // redirect to ShowAll page
        $window.location.href= "#ShowAll";
    }

    /**
     *  Redirect to ShowAll page
     */
    $scope.showAll = function () {
        // redirect to ShowAll page
        $window.location.href= "#ShowAll";
    }

};
contactApp.controller(controllers);