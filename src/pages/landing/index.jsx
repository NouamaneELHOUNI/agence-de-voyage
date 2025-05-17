import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainNav } from "./components/main-nav";
import { Footer } from "./components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { TeamMember } from "./components/team-member";
import { Timeline } from "./components/timeline";
import { AnimatedCounter } from "./components/animated-counter";
import { Award, Clock, Globe, Users } from "lucide-react";

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1" dir="rtl">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <img
              src="/placeholder.svg?height=600&width=1920"
              alt="المسجد الحرام"
              className="object-cover w-full h-full brightness-50"
              loading="eager"
            />
          </div>
          <div className="container relative z-10 py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">عن الصفر للحج والعمرة</h1>
              <p className="mt-6 text-lg leading-8">
                شريككم الموثوق لرحلات الحج والعمرة منذ عام 2005. نقدم خدمات شاملة لجعل رحلتكم مريحة وذات معنى.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
              <div className="space-y-6 md:order-1">
                <h2 className="text-3xl font-bold tracking-tight">قصتنا</h2>
                <p className="text-muted-foreground">
                  تأسست خدمات الصفر للحج والعمرة في عام 2005 بمهمة بسيطة: تزويد الحجاج برحلة مريحة ومُلهمة روحياً إلى المدن المقدسة مكة المكرمة والمدينة المنورة.
                </p>
                <p className="text-muted-foreground">
                  ما بدأ كشركة عائلية صغيرة نما ليصبح واحداً من أكثر مزودي خدمات الحج والعمرة ثقة، حيث نخدم آلاف الحجاج من جميع أنحاء العالم كل عام. بدأ مؤسسنا، الحاج عبد الله رحمن، الشركة بعد أدائه الحج ولاحظ الحاجة إلى خدمة تعطي الأولوية للإرشاد الروحي والراحة الجسدية خلال الرحلة المقدسة.
                </p>
                <p className="text-muted-foreground">
                  على مر السنين، قمنا بتحسين خدماتنا باستمرار، مع دمج التعليقات من الحجاج والبقاء على اطلاع بأحدث اللوائح والمرافق في المملكة العربية السعودية. يضم فريقنا الآن مرشدين ذوي خبرة وعلماء وموظفي دعم مكرسين لجعل حجكم تجربة لا تُنسى.
                </p>
                <p className="text-muted-foreground">
                  اليوم، يُعرف الصفر بخدماته المتميزة واهتمامه بالتفاصيل والتزامه بضمان أن يركز الحجاج تماماً على رحلتهم الروحية بينما نهتم نحن بجميع الجوانب اللوجستية.
                </p>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-xl md:order-2">
                <img 
                  src="/placeholder.svg?height=800&width=800" 
                  alt="قصتنا" 
                  className="object-cover w-full h-full" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission & Values */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">مهمتنا وقيمنا</h2>
              <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                نسترشد بمجموعة من القيم الأساسية التي تحدد كيفية عملنا وخدمة حجاجنا.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-background">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">التميز في الخدمة</h3>
                  <p className="text-muted-foreground">
                    نسعى لتجاوز التوقعات في كل جانب من جوانب خدمتنا، من التحضير قبل المغادرة إلى الرحلة نفسها.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">الإرشاد الروحي</h3>
                  <p className="text-muted-foreground">
                    نوفر علماء على دراية يقدمون التوجيه حول المناسك والجوانب الروحية للحج والعمرة.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">النزاهة</h3>
                  <p className="text-muted-foreground">
                    نعمل بشفافية وأمانة في جميع تعاملاتنا، مما يضمن حصول الحجاج على ما تم وعدهم به بالضبط.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">التحسين المستمر</h3>
                  <p className="text-muted-foreground">
                    نبحث باستمرار عن التعليقات وندمج التحسينات لتعزيز تجربة الحج للمجموعات المستقبلية.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Achievements */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">إنجازاتنا</h2>
              <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                على مر السنين، حققنا إنجازات كبيرة في خدمة الحجاج من جميع أنحاء العالم.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <AnimatedCounter value={15000} duration={2000} className="text-4xl font-bold text-primary" />
                <p className="text-lg font-medium mt-2">الحجاج الذين تمت خدمتهم</p>
              </div>
              <div className="text-center">
                <AnimatedCounter value={18} duration={2000} className="text-4xl font-bold text-primary" />
                <p className="text-lg font-medium mt-2">سنوات من الخبرة</p>
              </div>
              <div className="text-center">
                <AnimatedCounter value={45} duration={2000} className="text-4xl font-bold text-primary" />
                <p className="text-lg font-medium mt-2">الدول التي نخدمها</p>
              </div>
              <div className="text-center">
                <AnimatedCounter value={98} duration={2000} className="text-4xl font-bold text-primary" suffix="%" />
                <p className="text-lg font-medium mt-2">معدل الرضا</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">مسيرتنا</h2>
              <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                من بداياتنا المتواضعة إلى أن أصبحنا من الرواد في تقديم خدمات الحج والعمرة.
              </p>
            </div>
            <Timeline />
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">تعرف على فريقنا</h2>
              <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                فريقنا المتخصص من المحترفين ملتزم بتقديم أفضل تجربة للحج والعمرة.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <TeamMember
                name="عبد الله رحمن"
                role="المؤسس والرئيس التنفيذي"
                image="/placeholder.svg?height=400&width=400&text=عر"
                bio="مع أكثر من 25 عاماً من الخبرة في تنظيم رحلات الحج والعمرة، أسس عبد الله شركة الصفر برؤية لتزويد الحجاج برحلة روحية مُلهمة."
              />
              <TeamMember
                name="د. فاطمة أحمد"
                role="كبيرة العلماء"
                image="/placeholder.svg?height=400&width=400&text=فأ"
                bio="د. فاطمة عالمة إسلامية متخصصة في مناسك الحج والعمرة. تقدم الإرشاد الروحي للحجاج طوال رحلتهم."
              />
              <TeamMember
                name="محمد علي"
                role="مدير العمليات"
                image="/placeholder.svg?height=400&width=400&text=مع"
                bio="يشرف محمد على جميع الجوانب التشغيلية لباقات الحج والعمرة لدينا، مما يضمن سلاسة الخدمات اللوجستية وأماكن إقامة مريحة للحجاج."
              />
              <TeamMember
                name="عائشة خان"
                role="العلاقات العامة"
                image="/placeholder.svg?height=400&width=400&text=عخ"
                bio="عائشة متخصصة في تقديم خدمة عملاء استثنائية، والرد على الاستفسارات، وضمان تلبية جميع احتياجات الحجاج قبل وأثناء وبعد رحلتهم."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">هل أنت مستعد لبدء رحلتك الروحية؟</h2>
              <p className="mt-6 text-lg leading-8 text-primary-foreground/90">
                اتصل بنا اليوم لحجز باقة الحج أو العمرة الخاصة بك. فريقنا مستعد لمساعدتك في تخطيط رحلتك المقدسة.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/contact">اتصل بنا</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <Link to="/packages">عرض الباقات</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;