import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faTiktok, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/layout/ContactForm";
import { getContactData } from "@/lib/contactData";

export default async function Contact() {
  const contactData = await getContactData();

  return (
    <main className="flex flex-col gap-16 py-8">
      {/* Başlık ve Açıklama */}
      <section className="container">
        <div className="mb-12 mx-auto text-center max-w-3xl">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">{contactData.pageContent.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {contactData.pageContent.description}
          </p>
        </div>

        {/* İletişim Bilgileri ve Form */}
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-3">
          {/* Sol Taraf - İletişim Bilgileri */}
          <div className="lg:col-span-1 space-y-6">
            {/* Adres Kartı */}
            <Card className="gap-2">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FontAwesomeIcon icon={faMapLocationDot} className="h-5 w-5" />
                </div>
                <CardTitle>{contactData.contactInfo.address.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic text-muted-foreground">
                  {contactData.contactInfo.address.content.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < contactData.contactInfo.address.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </address>
              </CardContent>
            </Card>

            {/* E-posta Kartı */}
            <Card className="gap-2">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
                </div>
                <CardTitle>{contactData.contactInfo.email.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <a href={`mailto:${contactData.contactInfo.email.content}`} className="hover:text-primary">
                    {contactData.contactInfo.email.content}
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Sosyal Medya */}
            <Card className="gap-2">
              <CardHeader className="pb-2">
                <CardTitle>{contactData.contactInfo.socialMedia.title}</CardTitle>
                <CardDescription>
                  {contactData.contactInfo.socialMedia.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {contactData.contactInfo.socialMedia.links.map((link, index) => {
                    const iconMap = {
                      'GitHub': faGithub,
                      'LinkedIn': faLinkedin,
                      'Tiktok': faTiktok,
                      'Instagram': faInstagram,
                    };
                    
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-3 hover:bg-accent/10 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={link.ariaLabel}
                      >
                        <FontAwesomeIcon 
                          icon={iconMap[link.platform as keyof typeof iconMap] || faGithub} 
                          className="h-6 w-6" 
                        />
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf - Form ve Harita */}
          <div className="lg:col-span-2 space-y-6">
            {/* İletişim Formu */}
            <ContactForm />
            
            {/* Konum Haritası */}
            <Card>
              <CardHeader>
                <CardTitle>{contactData.map.title}</CardTitle>
                <CardDescription>
                  {contactData.map.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] w-full overflow-hidden rounded-md border border-border">
                  <iframe 
                    src={contactData.map.embedUrl}
                    className="w-full h-full border-0" 
                    allowFullScreen 
                    loading="lazy" 
                    title={contactData.map.title}
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}