# Быстрая сортировка

Также известна как быстрая сортировка Хоара. В среднем выполняется за O(n*log(
n)).

[computer science](./meta_computer_science.md)

[алгоритмы сортировки](./meta_algoritmy_sortirovki.md)

### Основная идея

Построена на слиянии трёх массивов. В первом массиве все элементы меньше
опорного, в одном равны ему, а в оставшемся все элементы больше опорного. Мы
выбираем опорный элемент и делим исходный массив на части, потом каждую из
частей обрабатываем аналогичным образом.

### Реализация на python

```python
import random


def quicksort(sequence):
    """Быстрая сортировка.
    """
    if len(sequence) <= 1:
        return sequence

    base = random.choice(sequence)
    left = []
    middle = []
    right = []

    for element in sequence:
        if element == base:
            middle.append(element)
        elif element > base:
            right.append(element)
        else:
            left.append(element)

    return quicksort(left) + middle + quicksort(right)


digits = [5, 7, 0, 99, 74, 39, 22, 61, 97, 49, 12, 6, 33, 88, 99]
res = quicksort(digits)
print(res)
assert res == sorted(digits)
```

### На что обратить внимание

1. Важен способ выбора опорного элемента.
1. При неудачном раскладе, например когда мы в качестве опорного берём первый
   элемент, а массив уже почти отсортирован, сложность деградирует до O(n^2).
