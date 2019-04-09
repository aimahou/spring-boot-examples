package com.mayocase.java8;

import java.util.Arrays;
import java.util.List;
import java.util.Spliterator;
import java.util.Spliterator.OfInt;
import java.util.Spliterators;
import java.util.function.Consumer;
import java.util.function.DoubleUnaryOperator;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.junit.Test;


public class LambdaTest {
	
	//https://blog.csdn.net/Holmofy/article/details/77481304
	
	@Test
	public void lambdaTest0() {
	/*	
		
		// 多个参数
		(type1 arg1, type2 arg2...) -> { body }

		(int a, int b) -> {  return a + b; }

		// 可以显式声明参数的类型，也可以从上下文推断参数的类型。
		(arg1, arg2...) -> { body }

		(a, b) -> { return a + b; }

		// 一个参数
		(a) -> { return a * a; }
		// 参数列表只有一个参数可以省略：参数列表的小括号
		a -> { return a * a; }
		// 方法体只有一条语句可以省略：方法体大括号以及return关键字
		a -> a * a;

		// 没有参数，需要用一对空括号来表示
		() -> return 1;
		
		*/
	}
	

	@Test
	public void lambdaTest1() {
        Function<String, String> upcase = s -> s.toUpperCase();
        Consumer<String> print = s -> System.out.println(s);
        Predicate<String> isEmpty = s -> s.isEmpty();
        Supplier<String> getStr = () -> String.valueOf(Math.random());

        // 虽然可以这么用，但事实上我们很少这么用
        print.accept("Function的用法,转为大写字母："+ upcase.apply("Hello Lambda"));
        print.accept("Predicate用法，判断内容是否为空: " + isEmpty.test("Hello Lambda"));
        print.accept("Supplier用法：   "+getStr.get());
    }
	
	@Test
	public void lambdaTest2() {
		// 上面的几个赋值语句还可以这么写：
		Function<String, String> upcase = String::toUpperCase;// 未知对象的成员方法

		Consumer<String> print = System.out::println; // 已知对象的成员方法
		
		// 所以也允许这种语法
		StringBuilder builder = new StringBuilder();
		Consumer<String> append = builder::append;

		Predicate<String> isEmpty = String::isEmpty; // 对象成员方法
		DoubleUnaryOperator sin = Math::sin; // 静态成员方法(类成员方法)

		// 甚至还可以引用构造方法作为匿名函数
		Function<String, String> newStr = String::new;
		Supplier<String> getStr = String::new;
		
		
		// 虽然可以这么用，但事实上我们很少这么用
        print.accept("Function的用法,转为大写字母："+ upcase.apply("Hello Lambda"));
        print.accept("Predicate用法，判断内容是否为空: " + isEmpty.test("Hello Lambda"));
        print.accept(getStr.get());
		
	}
	
	@Test
	public  void lambdaTest3() {
        int[] arr = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        // 首先要创建一个int类型的Spliterator
        // 可以使用Spliterators工厂类为我们创建
        OfInt spliterator = Spliterators.spliterator(arr, 0, arr.length,
                Spliterator.ORDERED | Spliterator.IMMUTABLE);
        // 使用StreamSupport工厂类创建IntStream的实例对象
        IntStream intStream = StreamSupport.intStream(spliterator, false);
        intStream.map(i -> i * i)
                .filter(i -> i % 2 == 0)
                .forEach(System.out::println);
    }
	
	@Test
	public  void lambdaTest4() {
		// 数组创建Stream的方式
		int[] arr = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
		Arrays.stream(arr).map(i -> i * i)
		        .filter(i -> i % 2 == 0)
		        .forEach(System.out::println);

		// 直接对int序列创建Stream的方式
		// 实际上这个方法就是调用了 Arrays.stream(arr);
		IntStream.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
		        .map(i -> i * i)
		        .filter(i -> i % 2 == 0)
		        .forEach(System.out::println);
    }
	
	@Test
	public void lambdaTest5() {
		
		System.out.println("输出结果为：");
		Stream.of(Arrays.asList(1, 2, 3, 4), Arrays.asList(5, 6, 7, 8))
        	.flatMap(List::stream)
        	.forEach(System.out::print);
		// 输出结果为：1 2 3 4 5 6 7 8

		System.out.println("输出结果为：");
		IntStream.of(1, 2, 3, 4)
        	.flatMap(i -> IntStream.of(i, 2 * i, 3 * i))
        	.forEach(System.out::print);
		// 输出结果为：1 2 3 2 4 6 3 6 9 4 8 12
	}
	
	//Runnable接口也是函数式接口，所以我们也可以使用Lambda表达式来表示Runnable接口的实现
	@Test
	public void RunnableTest() {
		// 常规写法
        new Thread(new Runnable() {
            public void run() {
                printMessage("this is child thread");
            }
        }).start();
        
        
        // Lambda表达式写法
        new Thread(() -> printMessage("this is child thread")).start();
	
	}
	
	public static void printMessage(String msg) {
        System.out.println(Thread.currentThread().getName() + ":" + msg);
    }
	
	
	
}