"""
冒泡排序算法实现
Bubble Sort Algorithm Implementation

冒泡排序是一种简单的排序算法，它重复地遍历要排序的数列，
一次比较两个元素，如果它们的顺序错误就把它们交换过来。
遍历数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。
"""


def bubble_sort(arr):
    """
    冒泡排序函数
    
    参数:
        arr: 待排序的列表
    
    返回:
        排序后的列表
    """
    # 复制列表，避免修改原列表
    arr = arr.copy()
    n = len(arr)
    
    # 外层循环控制排序轮数
    for i in range(n):
        # 标志位，用于优化：如果本轮没有发生交换，说明已经有序
        swapped = False
        
        # 内层循环进行相邻元素比较和交换
        # 每轮排序后，最大的元素会"冒泡"到末尾，所以可以减少比较范围
        for j in range(0, n - i - 1):
            # 如果前一个元素大于后一个元素，则交换
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # 如果本轮没有发生交换，说明数组已经有序，可以提前结束
        if not swapped:
            break
    
    return arr


def bubble_sort_descending(arr):
    """
    降序冒泡排序函数
    
    参数:
        arr: 待排序的列表
    
    返回:
        降序排序后的列表
    """
    arr = arr.copy()
    n = len(arr)
    
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            # 改为小于号，实现降序
            if arr[j] < arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        if not swapped:
            break
    
    return arr


# 测试代码
if __name__ == "__main__":
    # 测试用例1: 普通数组
    test_array1 = [10, 20, 30, 41]
    print("原始数组:", test_array1)
    sorted_array1 = bubble_sort(test_array1)
    print("升序排序:", sorted_array1)
    print("原数组未被修改:", test_array1)
    print()
    
    # 测试用例2: 已排序数组
    test_array2 = [1, 2, 3, 4, 5]
    print("原始数组:", test_array2)
    sorted_array2 = bubble_sort(test_array2)
    print("升序排序:", sorted_array2)
    print()
    
    # 测试用例3: 逆序数组
    test_array3 = [5, 4, 3, 2, 1]
    print("原始数组:", test_array3)
    sorted_array3 = bubble_sort(test_array3)
    print("升序排序:", sorted_array3)
    print()
    
    # 测试用例4: 包含重复元素
    test_array4 = [3, 1, 4, 1, 5, 9, 2, 6, 5]
    print("原始数组:", test_array4)
    sorted_array4 = bubble_sort(test_array4)
    print("升序排序:", sorted_array4)
    print()
    
    # 测试用例5: 降序排序
    test_array5 = [64, 34, 25, 12, 22, 11, 90]
    print("原始数组:", test_array5)
    sorted_array5 = bubble_sort_descending(test_array5)
    print("降序排序:", sorted_array5)
    print()
    
    # 测试用例6: 单个元素
    test_array6 = [42]
    print("原始数组:", test_array6)
    sorted_array6 = bubble_sort(test_array6)
    print("升序排序:", sorted_array6)
    print()
    
    # 测试用例7: 空数组
    test_array7 = []
    print("原始数组:", test_array7)
    sorted_array7 = bubble_sort(test_array7)
    print("升序排序:", sorted_array7)

    # 测试用例8: 演示如何使用 bubble_sort_descending 进行降序排序
    # 创建一个包含若干整数的测试数组
    test_array8 = [10, 20, 30, 41]
    # 输出原始数组，以便观察排序前的数据
    print("原始数组:", test_array8)
    # 调用 bubble_sort_descending 对原始数组进行降序排序（原数组不会被修改）
    sorted_array8 = bubble_sort_descending(test_array8)
    # 输出降序排序后的新数组
    print("降序排序:", sorted_array8)


    # INSERT_YOUR_CODE
    # Python基础语法讲解文章大纲

    print("\n--- Python基础语法讲解文章大纲 ---\n")
    outline = [
        "一、Python简介",
        "    1. Python的起源与发展",
        "    2. 应用领域和优势",
        "二、Python基本语法",
        "    1. 注释的使用",
        "    2. 标识符与关键字",
        "    3. 缩进与代码块",
        "三、数据类型与变量",
        "    1. 常见数据类型（int, float, str, bool, list, tuple, dict, set）",
        "    2. 变量的定义与命名规范",
        "    3. 类型转换",
        "四、运算符",
        "    1. 算术运算符",
        "    2. 比较运算符",
        "    3. 逻辑运算符",
        "    4. 赋值运算符",
        "    5. 成员与身份运算符",
        "五、流程控制",
        "    1. 条件语句if-elif-else",
        "    2. 循环语句for、while",
        "    3. break 和 continue",
        "六、函数的定义与使用",
        "    1. 函数的基本结构",
        "    2. 参数和返回值",
        "    3. 变量作用域",
        "    4. lambda表达式",
        "七、常用内置数据结构",
        "    1. 字符串操作",
        "    2. 列表与元组",
        "    3. 字典与集合",
        "八、模块与包",
        "    1. 导入模块的方式",
        "    2. 标准库简介",
        "    3. 第三方库与pip安装",
        "九、文件操作",
        "    1. 文件的读写",
        "    2. 上下文管理（with语法）",
        "十、异常处理",
        "    1. try-except语句",
        "    2. 异常的捕获与抛出",
        "十一、面向对象基础",
        "    1. 类与对象",
        "    2. 属性与方法",
        "    3. 继承与多态",
        "十二、总结与进阶建议"
    ]
    for line in outline:
        print(line)

