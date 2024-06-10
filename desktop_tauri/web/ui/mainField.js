export class ContainerController {
    
    constructor(){

    }

    static toggleContainers() {
        var containers = document.querySelectorAll('.plain, .threeD-container'); // Получаем все контейнеры
        var visibleContainerIndex = -1; // Индекс видимого контейнера
    
        // Находим индекс видимого контейнера
        for (var i = 0; i < containers.length; i++) {
            if (containers[i].style.display !== 'none') {
                visibleContainerIndex = i;
                break;
            }
        }
    
        // Скрываем текущий видимый контейнер
        if (visibleContainerIndex !== -1) {
            containers[visibleContainerIndex].style.display = 'none';
        }
    
        // Определяем следующий контейнер для отображения
        var nextContainerIndex = (visibleContainerIndex + 1) % containers.length;
    
        // Показываем следующий контейнер
        containers[nextContainerIndex].style.display = 'grid';
    }
}
