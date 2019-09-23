(function () {
  'use strict';

  angular.module('app').component('home', {
    controller: HomeController,
    controllerAs: 'vm',
    templateUrl: 'app/home/home.view.html',
  });

  /** @ngInject */
  function HomeController($state, $http, $scope) {
    const vm = this;

    vm.submitted = false;
    vm.data = {
      categories: []
    };
    $scope.categories = [
      { id: 50, text: '100% OFF' },
      { id: 21, text: 'Databases' },
      { id: 9, text: 'Design' },
      { id: 24, text: 'Development Tools' },
      { id: 25, text: 'E-Commerce' },
      { id: 20, text: 'Game Development' },
      { id: 6, text: 'IT and Software' },
      { id: 10, text: 'Marketing' },
      { id: 18, text: 'Mobile Apps' },
      { id: 3, text: 'Development' }
    ];

    $scope.selectedList = [];



    if (!localStorage.credentials) {
      vm.showLogin = true;
    }

    vm.saveCredentials = () => {
      const credentials = {
        username: vm.username,
        password: vm.password
      };
      // eslint-disable-next-line angular/json-functions
      localStorage.setItem('credentials', JSON.stringify(credentials));
      $state.reload();
    };

    vm.getInfo = () => {
      const htmlString = html2json(`<ul class="requirements__list">
      <li class="requirements__item">PHP Basics are required</li>
      </ul>`);

      console.log(htmlString);


      return;
      vm.data.categories = [];
      $scope.selectedList.forEach((el, index) => {
        if (el) {
          vm.data.categories.push(index);
        }
      });

      const htmlData = JSON.stringify(vm.courseHtml)

      vm.submitted = true;
      /** --------------- */
      const subTitle = htmlData.substring(htmlData.indexOf('<h1'), htmlData.indexOf('</h1'));
      var title = subTitle.substring(subTitle.indexOf('\\n') + 2, subTitle.length - 2);
      title = title.replace(/&amp;/g, '&');
      vm.data.title = title;


      const subHeadLine = htmlData.substring(htmlData.indexOf('clp-lead__headline'));
      const subHeadLine2 = subHeadLine.substring(subHeadLine.indexOf('\\n') + 2);
      var headLine = subHeadLine2.substring(0, subHeadLine2.indexOf('\\n'));
      headLine = headLine.replace(/&amp;/g, '&');
      vm.data.excerpt = headLine;

      const subImage = htmlData.substring(htmlData.indexOf('srcset=\\"') + 9);
      const subImage2 = subImage.substring(subImage.indexOf('1x') + 4);
      const image = subImage2.substring(0, subImage2.indexOf('2x') - 1);

      vm.image = image;

      /** --------------- */
    };

    vm.reset = () => {
      vm.courseHtml = '';
      vm.submitted = false;
      vm.data = {};
    };

    vm.send = () => {
      console.log(vm.data);
      vm.httpSendPost(vm.data).then(() => {
        vm.reset();
      });
    };

    vm.httpSendPost = data => {
      const { username, password } = JSON.parse(localStorage.getItem('credentials'));
      const DTO = {
        data,
        image: vm.image,
        basic: authenticateUser(username, password)
      }

      return $http.post('/post', DTO);
    };

    function authenticateUser(username, password) {
      return "Basic " + btoa(username + ":" + password);
    }

  }

})();
