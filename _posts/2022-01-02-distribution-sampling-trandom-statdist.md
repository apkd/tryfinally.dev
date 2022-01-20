---
layout: post
title:  Distribution sampling in C# using StatDist and Troschuetz.Random
excerpt: learn how to sample various common probability distributions in C#
thumbtext: StatDist + TRandom
image: assets/img-min/cover/J9mO6DVgPJY.webp
categories: [csharp]
tags: [csharp]
author: apkd
series: false
featured: false
hidden: false
license: cc-by
contributors: []
---

Imagine you want to sample a statistical distribution. Say, you're spawning some loot and you need to decide how much the reward is worth - usually close to some average value, but with a small chance for a jackpot. You have a rough idea of what *shape* your imaginary reward value distribution is, but absolutely no idea what code to type.

Here's one workflow I like:

* chapter 1
* chapter 2
* chapter 3
{:toc}

# Finding the distribution w/ [StatDist](https://statdist.com/)

[StatDist](https://statdist.com/) is a small web app that lets you plot distributions online. It supports dozens of common statistical distribution.

![statdist.com screenshot](assets/img/posts/statdist-01.png)
*(Distributions shaded red are not supported by TRandom)*
{:.text-center}

Simply choose a distribution, input the parameters and you'll get an overview of how the distribution behaves. Thankfully, the scary equations are hidden by default, but there's a *Details* button for
the brave. The graphs and the `x` parameter (which lets us check the `P(x)`) are useful for playing around with the distribution to gain some intuition about it.

![statdist.com screenshot](assets/img/posts/statdist-02.png)

# Sampling distributions w/ [Troschuetz.Random](https://nuget.org/packages/Troschuetz.Random)

[Troschuetz.Random](https://nuget.org/packages/Troschuetz.Random) is a NuGet package that contains various random number generators and distributions. In a lot of cases, you can simply copy the
parameters chosen using StatDist into the function call.

```csharp
var random = new Troschuetz.Random.TRandom();
double sample = random.Normal(mu: 5, sigma: 0.1);
```

# Distributions supported by both [TRandom](https://nuget.org/packages/Troschuetz.Random) and [StatDist](https://statdist.com/)

Here's the functions you can use. Also check out [this article by the package author](https://www.codeproject.com/articles/15102/net-random-number-generators-and-distributions) and the [API docs](https://pomma89.gitlab.io/troschuetz-random/class_troschuetz_1_1_random_1_1_t_random.html).

## `double Beta(double alpha, double beta);`{:.language-cs .highlight}
{:.h5}

> 
0 < α < ∞<br>
0 < β < ∞<br>
0 ≤ X ≤ 1
{:.small}

* [View on StatDist](https://statdist.com/distributions/beta)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Beta_distribution)

## `int Binomial(double alpha, int beta);`{:.language-cs .highlight}
{:.h5}

> 
0 ≤ α ≤ 1<br>
β ∈ { 0, 1, ... }<br>
X ∈ { 0, 1, ..., β }
{:.small}

* [View on StatDist](https://statdist.com/distributions/binomial)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Binomial_distribution)

## `double Cauchy(double alpha, double gamma);`{:.language-cs .highlight}
{:.h5}

> 
-∞ < α < ∞<br>
0 < γ < ∞<br>
-∞ < X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/cauchy)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Cauchy_distribution)

## `double ChiSquare(int alpha);`{:.language-cs .highlight}
{:.h5}

> 
α ∈ { 1, 2, ... }<br>
0 ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/chi-squared)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Chi-squared_distribution)

## `double ContinuousUniform(double alpha, double beta);`{:.language-cs .highlight}
{:.h5}

> 
α ≤ β < ∞<br>
-∞ < α ≤ β<br>
α ≤ X < β
{:.small}

* [View on StatDist](https://statdist.com/distributions/uniform)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Continuous_uniform_distribution)

## `int DiscreteUniform(int alpha, int beta);`{:.language-cs .highlight}
{:.h5}

> 
α ∈ { ..., β-1, β}<br>
β ∈ { α, α+1, ... }<br>
X ∈ { α, α+1, ..., β-1, β }
{:.small}

* There's a [continuous version](#double-continuousuniformdouble-alpha-double-beta)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Discrete_uniform_distribution)

## `double Erlang(int alpha, double lambda);`{:.language-cs .highlight}
{:.h5}

> 
0 < α < ∞<br>
λ ∈ { 1, 2, ... }<br>
0 ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/erlang)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Erlang_distribution)

## `double Exponential(double lambda);`{:.language-cs .highlight}
{:.h5}

> 
0 < λ < ∞<br>
0 ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/exponential)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Exponential_distribution)

## `double FisherSnedecor(int alpha, int beta);`{:.language-cs .highlight}
{:.h5}

> 
α ∈ {1, 2, ... }<br>
β ∈ {1, 2, ... }<br>
0 ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/f)
* [View on Wikipedia](https://en.wikipedia.org/wiki/F-distribution)

## `double Gamma(double alpha, double beta);`{:.language-cs .highlight}
{:.h5}

> 
0 < α < ∞<br>
0 < θ < ∞<br>
0 ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/gamma)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Gamma_distribution)

## `double Laplace(double alpha, double mu);`{:.language-cs .highlight}
{:.h5}

> 
0 < α < ∞<br>
-∞ < μ < ∞<br>
-∞ < X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/laplace)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Laplace_distribution)

## `double Logistic(double mu, double sigma);`{:.language-cs .highlight}
{:.h5}

> 
0 < alpha < ∞<br>
0 < beta < ∞<br>
0 ≤ X ≤ 1
{:.small}

* [View on StatDist](https://statdist.com/distributions/logistic)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Logistic_distribution)

## `double Lognormal(double mu, double sigma);`{:.language-cs .highlight}
{:.h5}

> 
-∞ < μ < ∞<br>
0 ≤ σ < ∞<br>
0 ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/log-normal)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Log-normal_distribution)

## `double Normal(double mu, double sigma);`{:.language-cs .highlight}
{:.h5}

> 
-∞ < μ < ∞<br>
0 < σ < ∞<br>
-∞ < X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/normal)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Normal_distribution)

## `double Pareto(double alpha, double beta);`{:.language-cs .highlight}
{:.h5}

> 
0 < α < ∞<br>
0 < β < ∞<br>
α ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/pareto)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Pareto_distribution)

## `int Poisson(double lambda);`{:.language-cs .highlight}
{:.h5}

> 
0 < λ < ∞<br>
X ∈ { 0, 1, ... }
{:.small}

* [View on StatDist](https://statdist.com/distributions/poisson)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Poisson_distribution)

## `double Rayleigh(double sigma);`{:.language-cs .highlight}
{:.h5}

> 
0 < σ < ∞<br>
0 ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/rayleigh)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Rayleigh_distribution)

## `double StudentsT(int nu);`{:.language-cs .highlight}
{:.h5}

> 
ν ∈ { 1, 2, ... }<br>
-∞ < X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/student-t)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Student%27s_t-distribution)

## `double Triangular(double alpha, double beta, double gamma);`{:.language-cs .highlight}
{:.h5}

> 
-∞ < α < β<br>
α < β < ∞<br>
α ≤ γ ≤ β<br>
α ≤ X ≤ β
{:.small}

* [View on StatDist](https://statdist.com/distributions/triangular)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Triangular_distribution)

## `double Weibull(double alpha, double lambda);`{:.language-cs .highlight}
{:.h5}

> 
0 < α < ∞<br>
0 < λ < ∞<br>
0 ≤ X < ∞
{:.small}

* [View on StatDist](https://statdist.com/distributions/weibull)
* [View on Wikipedia](https://en.wikipedia.org/wiki/Weibull_distribution)
