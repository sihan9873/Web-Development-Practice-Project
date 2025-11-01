/**
 * 快速排序算法实现
 * Quick Sort Algorithm Implementation
 *
 * 快速排序通过选择一个“枢轴”元素，将数组分割为两个子数组：
 * 左侧元素小于等于枢轴，右侧元素大于等于枢轴，然后递归地对子数组排序。
 */
public class QuickSort {

    /**
     * 对数组进行升序快速排序，返回排序后的新数组。
     *
     * @param source 待排序数组
     * @return 排序后的数组
     */
    public static int[] quickSortAscending(int[] source) {
        if (source == null) {
            return null;
        }

        int[] arr = source.clone();
        quickSort(arr, 0, arr.length - 1);
        return arr;
    }

    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    /**
     * Lomuto 分区方案。
     */
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                swap(arr, i, j);
                i++;
            }
        }

        swap(arr, i, high);
        return i;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    /**
     * 对数组进行降序快速排序，返回排序后的新数组。
     *
     * @param source 待排序数组
     * @return 降序排序后的数组
     */
    public static int[] quickSortDescending(int[] source) {
        int[] arr = quickSortAscending(source);
        reverse(arr);
        return arr;
    }

    private static void reverse(int[] arr) {
        if (arr == null) {
            return;
        }

        int left = 0;
        int right = arr.length - 1;

        while (left < right) {
            swap(arr, left, right);
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        int[] testArray1 = {10, 20, 30, 41};
        printResult("测试用例1: 10,20,30,41", testArray1);

        int[] testArray2 = {64, 34, 25, 12, 22, 11, 90};
        printResult("测试用例2: 普通数组", testArray2);

        int[] testArray3 = {5, 4, 3, 2, 1};
        printResult("测试用例3: 逆序数组", testArray3);

        int[] testArray4 = {3, 1, 4, 1, 5, 9, 2, 6, 5};
        printResult("测试用例4: 含重复元素", testArray4);

        int[] testArray5 = {42};
        printResult("测试用例5: 单个元素", testArray5);

        int[] testArray6 = {};
        printResult("测试用例6: 空数组", testArray6);
    }

    private static void printResult(String title, int[] source) {
        System.out.println(title);
        System.out.print("原始数组: ");
        printArray(source);

        int[] ascending = quickSortAscending(source);
        System.out.print("升序排序: ");
        printArray(ascending);

        int[] descending = quickSortDescending(source);
        System.out.print("降序排序: ");
        printArray(descending);
        System.out.println();
    }

    private static void printArray(int[] arr) {
        if (arr == null) {
            System.out.println("null");
            return;
        }

        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println("]");
    }
}

