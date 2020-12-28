# Сортировка выбором

Один из самых простых алгоритмов сортировки, выполняется за O(n^2).

[computer science](./meta_computer_science.md)

[алгоритмы сортировки](./meta_algoritmy_sortirovki.md)


### Основная идея

Мы постоянно вытаскиевам минимальный элемент из массива и 
перекладываем его в отсортированный массив. Когда в исходном массиве не 
останется элементов, выходной массив можно будет считать отсортированным.

### Реализация на python

```python
from typing import List

array = [72, 56, 2, 6, 98, 30, 60, 23, 53, 22, 0, 99, 14]
sorted_array = [0, 2, 6, 14, 22, 23, 30, 53, 56, 60, 72, 98, 99]


def selection_sort(_array: List[int]) -> None:
    for i in range(len(_array)):
        minimum = _array[i]
        minimum_index = i

        for j in range(i, len(_array)):
            if _array[j] < minimum:
                minimum = _array[j]
                minimum_index = j

        if _array[i] > _array[minimum_index]:
            _array[i], _array[minimum_index] = _array[minimum_index], _array[i]


assert array != sorted_array
selection_sort(array)
assert array == sorted_array
```

### На что обратить внимание

1. Сортировка выбором в разных реализация может быть как устойчива, так и неустойчива.
1. Во внутреннем цикле счёт идёт от i а не от нуля т.к. в начале массива 
находятся уже отсортированные элементы.
1. В идеальном случае сортировка всё-равно выполнится за O(n^2).