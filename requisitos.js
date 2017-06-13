angular.module('ghr.requisitos', ['ghr.caracteristicas', 'ghr.candidatos', 'toastr']) // Creamos este modulo para la entidad requisitos
  .component('ghrRequisitos', { // Componente que contiene la url que indica su html
    templateUrl: '../bower_components/component-requisitos/requisitos.html',
    // El controlador de ghrrequisitos
    controller($stateParams, requisitosFactory, $state, caracteristicasFactory, candidatoFactory, toastr) {
      const vm = this;
      vm.mode = $stateParams.mode;
      vm.modos = '';
      vm.aparece = function () {
        if (vm.modos == '') {
          vm.modos = 'aparece';
        } else {
          vm.modos = '';
        }
      };
      vm.reset = function (form) {
        vm.requisitos = angular.copy(vm.original);
      };
      vm.borrar = function (idLista, idRequisito) {
        requisitosFactory.delete(idLista, idRequisito).then(function () {
          toastr.success('El requisito se ha borrado correctamente');
          $state.go($state.current, {
            mode: 'view'
          });
        });
      };
      if ($stateParams.id != 0) {
        candidatoFactory.read($stateParams.id).then(function (candidato) {
          vm.original = requisitosFactory.read(candidato.listaDeRequisitoId).then(function (requisitos) {
            vm.requisitos = requisitos;
            vm.idListaRequisitos = candidato.listaDeRequisitoId;
            caracteristicasFactory.getAll().then(function (caracteristicas) {
              vm.caracteristicas = caracteristicas;
              vm.arrayCaracteristicas = [];
              for (var i = 0; i < vm.requisitos.length; i++) {
                for (var j = 0; j < vm.caracteristicas.length; j++) {
                  if (vm.requisitos[i].caracteristicaId == vm.caracteristicas[j].id) {
                    vm.arrayCaracteristicas.push(vm.caracteristicas[j]);
                  }
                }
              }
              vm.caracteristicasNombres = [];
              for (var i = 0; i < vm.caracteristicas.length; i++) {
                vm.caracteristicasNombres.push(vm.caracteristicas[i].nombre);
              }
            });
          });
        });
      }
    }
  })
  .constant('baseUrl', 'http://localhost:3003/api/')
  .constant('reqEntidad', 'listaDeRequisitos')
  .factory('requisitosFactory', function crearRequisitos($http, baseUrl, reqEntidad, caracteristicasFactory, candidatoFactory) {
    var serviceUrl = baseUrl + reqEntidad;
    return {
      // sistema CRUD de requisito
      //
      getAll: function getAll() {
        return $http({
          method: 'GET',
          url: serviceUrl
        }).then(function onSuccess(response) {
          return response.data;
        },
          function onFailirure(reason) {});
      },
      create: function create(idLista, requisito) {
        return $http({
          method: 'POST',
          url: serviceUrl + '/' + idLista + '/' + 'requisitos',
          data: requisito
        }).then(function onSuccess(response) {
          return response.data;
        },
          function onFailirure(reason) {});
      },
      createList: function createList() {
        return $http({
          method: 'POST',
          url: serviceUrl

        }).then(function onSucces(response) {
          return response.data;
        });
      },
      read: function read(id) {
        return $http({
          method: 'GET',
          url: serviceUrl + '/' + id + '/requisitos'
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
      delete: function _delete(idLista, idRequisito) {
        return $http({
          method: 'DELETE',
          url: serviceUrl + '/' + idLista + '/' + 'requisitos' + '/' + idRequisito
        });
      }
    };
  })
  .component('eliminarRequisitoModal', { // El componente del modal
    templateUrl: '../bower_components/component-requisitos/eliminarRequisitoModal.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: function () {
      const vm = this;
      vm.$onInit = function () {
        vm.selected = vm.resolve.seleccionado;
      };
      vm.ok = function (seleccionado) { // Este metodo nos sirve para marcar el candidato que se ha seleccionado
        vm.close({
          $value: seleccionado
        });
      };
      vm.cancel = function () { // Este metodo cancela la operacion
        vm.dismiss({
          $value: 'cancel'
        });
      };
    }
  })
  .run($log => {
    $log.log('Ejecutando Componente Requisitos');
  });
