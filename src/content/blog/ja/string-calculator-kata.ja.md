---
template: blog-post
title: String Calculator Kata
slug: /ja/kata
date: 2020-05-12 13:11:00+00:00
description: "実施したKataの説明"
featuredImage: /assets/images/posts/architecture-3362794_1920.jpg
tags: ['コミュニティ', '学習', 'Kata', 'Coding-dojo', 'TDD', 'Java', 'ブログ']

---
## はじめに

5月11日、Lean Mindの同僚がビデオ通話で集まり、***Kata***と呼ばれる共同演習を実行することを提案してくれました。これは、前回の投稿で既に話した**TDD**方法論を実装して、段階的に問題に対処することで構成されています。彼らはしばしばこれらの会議を***Coding dojo***と呼んでいます。これは非常に適切な用語です。なぜなら、未知の方法論を学び、弱いものを練習し、コンフォートゾーンから抜け出して知らない人とコミュニケーションを取ることを学ぶトレーニングだからです。

前回の投稿で述べたように、私は1月24日B.C.（コロナウイルス前）にLean Mindオフィスで以前のコーディング道場の1つに参加しました。真実は、それは私が多くを学んだ非常に豊かな発見だったということです。

[![](https://airanschez.files.wordpress.com/2020/05/codingdojoleanmind.jpg?w=1024)](https://leanmind.es/es/blog/property-based-testing/ " ")

## String Calculatorとは何ですか？

名前自体が示すように提示される問題が与えられた場合、数値変数を受け取る代わりに、文字列型変数を受け取る計算機を作成する必要があります。これを行うために、最初に行ったのは、全員が同じラインにいて、すべてが簡単になるように共通の作業環境を構成することでした。intelliJを使用するのは初めてで、Eclipseを1年間使用した後、それは神の啓示でした（特にエラー修正と依存関係のインポートのために）。冗談はさておき、IDEは非常に良いです。少なくともJavaで使用するには。

kataを開始するために、いくつかの可能なエントリを含むto-doリストを作成しました：

1番目のケース：「」-> 0\
2番目のケース：「1」-> 1\
3番目のケース：「3,2」-> 5\
\
各ケースについて、TDD方法論の赤-緑-リファクタリングに従って問題のテストを実行します。一般的に、テストは複雑ではなく、入力出力のバリアントはありますが、すべて非常に似ています。

![最初のケース](/assets/images/posts/anotacic3b3n-2020-05-12-171736.png " ")

![2番目のケース](/assets/images/posts/anotacic3b3n-2020-05-12-171749.png " ")

![3番目のケース](/assets/images/posts/anotacic3b3n-2020-05-12-171802-1.png " ")

テストを作成して失敗することを確認した後、**機能させるための最小限のコードを配置**する時が来ました（経験不足のために、最も最適なアルゴリズムを求めて何度もスキップしたため、できるだけシンプルにすることが非常に重要です）。最初のKataパートナーであるBorjaのおかげで、TDDを行うときは速度を落とし、屋根から家を建てたくないように、段階的に考える必要があることを学びました。

想定される30〜40分の演習は飛んで行き、その後、すべてを削除して別のアプローチといくつかの追加の難しさで再び開始するように求められました。これは再帰を行うことで構成されていました。2番目のパートナーである[Rubén Zamora](https://rubenzagon.me/)は、このタスクで私をガイドしたいと思っていました。何度も紆余曲折した後...私たちはやりました！見たい場合は、[Githubリポジトリ](https://github.com/AiranSchez/StringCalculatorKata)へのリンクをここに残しますが、許可していただければ、私の同僚の1人である[Raúl Padilla](https://blog.raulpadilladelgado.com/)の手による素晴らしいソリューションをお見せしたいと思います：

## コード

```java
public class StringCalculator {
    public static int add(String s){
        if(s.isEmpty()){
           return 0;
        }
        if(!s.contains(",")){
           return parseInt(s);
        }

        List<String> numbers = Arrays.asList(s.Split(","));
        int result = 0;
        return sum_strings(numbers, result);
    }

    private static int sum_strings(List<String> numbers, int result){
        if(numbers.size() > 0){
            result += parseInt(numbers.get(0));
            List<String> rest = numbers.subList(1, numbers.size());
            result sum_strings(rest, result);
        }
        return result;
    }
}
```



## 何を学びましたか？

これは、実際の演習でTDDを実装する私の2番目の経験であり、真実は、私がコツをつかんでおり、予想よりもはるかに気に入っているということです。前述のように、赤-緑-リファクタリングに可能な限り固執し、2番目のステップで完全なソリューションを実装しようとしないでください。機能させるための最小限のコードを求める方が良いです。残りは後で来ます。

最後に、コーディング道場にいたすべての人に感謝したいと思います。受けたサポートは非常に素晴らしく、素晴らしい時間を過ごしました。次を楽しみにしています

