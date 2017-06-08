angular.module('ghr.requisitos', ['ghr.caracteristicas', 'ghr.candidatos']) // Creamos este modulo para la entidad requisitos
  .component('ghrRequisitos', { // Componente que contiene la url que indica su html
    templateUrl: '../bower_components/component-requisitos/requisitos.html',
    // El controlador de ghrrequisitos
    controller($stateParams, requisitosFactory, $state, caracteristicasFactory, candidatoFactory) {
      const vm = this;
      vm.mode = $stateParams.mode;
      vm.objetoFormulario = function (nombreRequisito, nivelRequisito) {
        caracteristicasFactory.getAll().then(function onSuccess(response){
          vm.elObjeto ={
            caracteristicaId : sacarCaracteristicaId(),
            nivel : nivelRequisito,
            listaDeRequisitoId: vm.idListaRequisitos
          };
          function sacarCaracteristicaId(){
            for (var i = 0; i < response.length; i++) {
              if(response[i].nombre == nombreRequisito){
                return response[i].id
              }
            }
          }
          requisitosFactory.create(vm.idListaRequisitos,vm.elObjeto);
          $state.go($state.current, {
              mode: 'view'
          });
        });
      }
      requisitosFactory.getAll().then(function onSuccess(response) {
        vm.arrayRequisitos = response.filter(function (requisito) {
          return requisito.idCandidato == $stateParams.id;
        });
      });
      vm.crearInput = function (requisitos) {
        vm.arrayRequisitos = requisitos;
        vm.arrayRequisitos.push({
        });
      };
      vm.createRequisito = function (idLista, nombre, nivel) {
        console.log(idLista);
        console.log(nivel);
        console.log(nombre);
        var id;
        for (var i = 0; i < vm.arrayCaracteristicas.length; i++) {
          if (vm.arrayCaracteristicas[i].nombre == nombre) {
            id = vm.arrayCaracteristicas.id;
            console.log(id);
          }
        }
        requisito = {
          caracteristicaId: id, // sacarla
          nivel: nivel
        };
        requisitosFactory.create(idLista, requisito).then(function (requisito) {
          vm.nuevoRequisito = requisito;
        });
      };
      vm.update = function (user) {
        if ($stateParams.id == 0) {
          delete $stateParams.id;
          requisitosFactory.create(vm.requisitos).then(function (requisito) {
            $state.go($state.current, {
              id: requisito.id
            });
          });
        }
        if (vm.form.$dirty === true) {
          requisitosFactory.update(vm.requisitos).then(function (requisito) {});
        }
      };
      vm.reset = function (form) {
        vm.requisitos = angular.copy(vm.original);
      };
      vm.borrar = function (idLista, idRequisito) {
        requisitosFactory.delete(idLista, idRequisito).then(function () {
          $state.go($state.current, {
            mode: 'view'
          });
        });
      };
      vm.prueba;
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
              // console.log(vm.caracteristicasNombres);
            });
            // console.log(' LENGTH DE ARRAY REQUISITOS: ' + vm.requisitos.length);
            // vm.comprobar(vm.requisitos);
          });
        });
      }
    }
  })
  .constant('baseUrl', 'http://localhost:3003/api/')
  .constant('reqEntidad', 'listaDeRequisitos')
  .factory('requisitosFactory', function crearrequisitos($http, baseUrl, reqEntidad, caracteristicasFactory, candidatoFactory) {
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
  // .component('ghrRequisitosList', {
  //   templateUrl: '../bower_components/component-requisitos/requisitos-list.html',
  //   controller(requisitosFactory, $uibModal, $log, $document) {
  //     const vm = this;
  //     requisitosFactory.getAll().then(function onSuccess(response) {
  //       vm.arrayRequisitos = response;
  //       vm.requisitos = vm.arrayRequisitos;
  //     });
  //     vm.currentPage = 1;
  //     vm.setPage = function (pageNo) {
  //       vm.currentPage = pageNo;
  //     };
  //     vm.maxSize = 10; // Elementos mostrados por página
  //
  //     // vm.open = function (id) {
  //     //   var modalInstance = $uibModal.open({
  //     //     component: 'eliminarRequisitoModal',
  //     //     resolve: {
  //     //       seleccionado: function () {
  //     //         return id;
  //     //       }
  //     //     }
  //     //   });
  //     //   modalInstance.result.then(function (selectedItem) {
  //     //     vm.arrayRequisitos = requisitosFactory.getAll();
  //     //     requisitosFactory.delete(selectedItem).then(function () {
  //     //       requisitosFactory.getAll().then(function (requisito) {
  //     //         vm.arrayRequisitos = requisito;
  //     //       });
  //     //     });
  //     //   });
  //     // };
  //   }
  // })
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
