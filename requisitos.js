angular.module('ghr.requisitos', []) // Creamos este modulo para la entidad requisitos
  .component('ghrRequisitos', { // Componente que contiene la url que indica su html
    templateUrl: '../bower_components/component-requisitos/requisitos.html',
    // El controlador de ghrrequisitos
    controller($stateParams, requisitosFactory, $state) {
      const vm = this;

      vm.mode = $stateParams.mode;

      requisitosFactory.getAll().then(function onSuccess(response) {
        vm.arrayRequisitos = response.filter(function (requisito) {
          return requisito.idCandidato == $stateParams.id;
        });
      });

      vm.update = function (user) {
        if ($stateParams.id == 0) {
          delete $stateParams.id;
          requisitosFactory.create(vm.requisito).then(function (requisito) {
            $state.go($state.current, {
              id: requisito.id
            });
          });
        }
        if (vm.form.$dirty === true) {
          requisitosFactory.update(vm.requisito).then(function (requisito) {});
        }
      };

      vm.reset = function (form) {
        vm.requisito = angular.copy(vm.original);
      };
      if ($stateParams.id != 0) {
        vm.original = requisitosFactory.read($stateParams.id).then(
          function (requisito) {
            vm.requisito = requisito;
          }
        );
      }
    }
  })
  .constant('baseUrl', 'http://localhost:3003/api/')
  .constant('reqEntidad', 'requisitos')
  .factory('requisitosFactory', function crearrequisitos($http, baseUrl, reqEntidad) {
    var serviceUrl = baseUrl + reqEntidad;
    return {
      // sistema CRUD de requisito
      getAll: function getAll() {
        return $http({
          method: 'GET',
          url: serviceUrl
        }).then(function onSuccess(response) {
          return response.data;
        },
          function onFailirure(reason) {

          });
      },
      create: function create(requisito) {
        return $http({
          method: 'POST',
          url: serviceUrl,
          data: requisito
        }).then(function onSuccess(response) {
          return response.data;
        },
          function onFailirure(reason) {

          });
      },
      read: function read(id) {
        return $http({
          method: 'GET',
          url: serviceUrl + '/' + id
        }).then(function onSuccess(response) {
          return response.data;
        });
        return angular.copy(_getReferenceById(id));
      },
      update: function update(requisito) {
        return $http({
          method: 'PATCH',
          url: serviceUrl + '/' + requisito.id,
          data: requisito
        }).then(function onSuccess(response) {
          return response.data;
        });
      },
      delete: function _delete(selectedItem) {
        return $http({
          method: 'DELETE',
          url: serviceUrl + '/' + selectedItem
        });
      }
    };
  })
  .component('ghrRequisitosList', {
    templateUrl: '../bower_components/component-requisitos/requisitos-list.html',
    controller(requisitosFactory, $uibModal, $log, $document) {
      const vm = this;

      requisitosFactory.getAll().then(function onSuccess(response) {
        vm.arrayRequisitos = response;
        vm.requisito = vm.arrayRequisitos;
      });

      vm.currentPage = 1;
      vm.setPage = function (pageNo) {
        vm.currentPage = pageNo;
      };

      vm.maxSize = 10; // Elementos mostrados por página
      vm.open = function (id, nombre) {
        var modalInstance = $uibModal.open({
          component: 'eliminarRequisitoModal',
          resolve: {
            seleccionado: function () {
              return id;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          vm.arrayRequisitos = requisitosFactory.getAll();
          requisitosFactory.delete(selectedItem).then(function () {
            requisitosFactory.getAll().then(function (requisito) {
              vm.arrayRequisitos = requisito;
            });
          });
        });
      };
    }
  })
  .run($log => {
    $log.log('Ejecutando Componente Requisitos');
  });
