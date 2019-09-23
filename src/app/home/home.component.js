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

  
      vm.data.categories = [];
      $scope.selectedList.forEach((el, index) => {
        if (el) {
          vm.data.categories.push(index);
        }
      });

      const htmlData = JSON.stringify(vm.courseHtml);

      vm.submitted = true;

      var h2Req = document.createElement('h2');
      h2Req.appendChild(document.createTextNode('Requirements'));
      var h2Desc = document.createElement('h2');
      h2Desc.appendChild(document.createTextNode('Description'));
  
      
      /** ---- Get Requirements ---- */
      const subRequiremenets = htmlData.substring(htmlData.indexOf('requirements__content'), htmlData.length);
      const subRequiremenets2 = subRequiremenets.substring(subRequiremenets.indexOf('<ul'), subRequiremenets.length);
      const subRequiremenets3 = subRequiremenets2.substring(0, subRequiremenets2.indexOf('</ul>') + 5);
      const requiremenets = decodeURI(subRequiremenets3)
      
      const htmlJsonString = html2json(decodeURI(requiremenets));
      const ulRequeriments = document.createElement('ul');
      
      htmlJsonString.child[0].child.forEach(el => {
        if (el.node === 'element') {
          var li = document.createElement('li');
          ulRequeriments.appendChild(li);
          li.innerHTML = li.innerHTML + el.child[0].text
        }
      });
      
      /** ---- Get Desc ---- */
      
      
      
      
      
      /** ---- Get audience ---- */
      const subAudience = htmlData.substring(htmlData.indexOf('audience__list') - 12, htmlData.length);
      const subAudience2 = subAudience.substring(0, subAudience.indexOf('</ul>') + 5);


      
      const htmlAudJsonString = html2json(decodeURI(subAudience2));
      const ulAudRequeriments = document.createElement('ul');
    
      htmlAudJsonString.child[0].child.forEach(el => {
        if (el.node === 'element') {
          var li = document.createElement('li');
          ulAudRequeriments.appendChild(li);
          li.innerHTML = li.innerHTML + el.child[0].text
        }
      });
      
      console.log(ulAudRequeriments);




      const courseBtn = document.createElement('figure');
      courseBtn.classList.add('wp-block-image');
      const courseLink = document.createElement('a');
      courseLink.target = '_blank';
      courseLink.rel = 'noreferrer noopener';
      courseLink.href = vm.courseLink;
      const linkImg = document.createElement('img');
      linkImg.src = 'https://techcoursesite.com/wp-content/uploads/2019/09/course-link.png';

      
      
      
      
      



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

      linkImg.alt = title;

      courseLink.appendChild(linkImg);
      courseBtn.appendChild(courseLink);

      const finalContent = h2Req.outerHTML + ulRequeriments.outerHTML + h2Desc.outerHTML + ulAudRequeriments.outerHTML + courseBtn.outerHTML;
      vm.data.content = finalContent;
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

    function htmlDecode(value){ 
      return $('<div/>').html(value).text(); 
    }

  }

})();
