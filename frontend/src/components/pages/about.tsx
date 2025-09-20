import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUsers, faBook, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AboutData } from '@/lib/aboutData';

interface AboutProps {
  data: AboutData;
}

export default function About({ data }: AboutProps) {
  const { pageContent, boardMembers, timelineEvents, focusAreas } = data;
  
  // Split board members into groups for better layout control
  const firstRowMembers = boardMembers.slice(0, 2);
  const secondRowMembers = boardMembers.slice(2, 4);
  const thirdRowMembers = boardMembers.slice(4);
  
  return (
    <main className="flex flex-col gap-16 pt-8">
      {/* Misyon ve Vizyon */}
      <section className="container">
        <div className="mb-12 mx-auto text-center max-w-3xl">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">{pageContent.missionVision.title}</h2>
        </div>
        
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faBook} className="h-5 w-5" />
              </div>
              <CardTitle>{pageContent.missionVision.mission.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {pageContent.missionVision.mission.description}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faGlobe} className="h-5 w-5" />
              </div>
              <CardTitle>{pageContent.missionVision.vision.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {pageContent.missionVision.vision.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Yönetim Kurulu */}
      <section className="container">
        <div className="mb-12 mx-auto text-center max-w-3xl">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">{pageContent.boardMembers.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {pageContent.boardMembers.description}
          </p>
        </div>
        
        <div className="mx-auto max-w-6xl space-y-6">
          {/* First row - 2 members */}
          {firstRowMembers.length > 0 && (
            <div className="flex justify-center gap-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-2xl w-full">
                {firstRowMembers.map((member, index) => (
                  <Card key={index} className="overflow-hidden gap-0">
                    <div className="p-2">
                      <AspectRatio ratio={1/1} className="bg-muted rounded-md overflow-hidden">
                        <div className="flex h-full w-full items-center justify-center bg-background">
                          {member?.image && !member.image.includes("placeholder") ? (
                            <Image 
                              src={member.image}
                              alt={`${member.name} fotoğrafı`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FontAwesomeIcon icon={faUsers} className="h-12 w-12 text-muted-foreground/50" />
                          )}
                        </div>
                      </AspectRatio>
                    </div>
                    
                    <CardHeader className="px-4 pt-4 pb-2">
                      <CardTitle className="text-xl">{member?.name}</CardTitle>
                      <CardDescription className="font-medium text-primary">
                        {member?.role}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="px-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {member?.department}
                      </p>
                      
                      <div className="flex gap-3">
                        {member?.github && (
                          <a 
                            href={member.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rounded-md p-2 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label={`${member.name} GitHub profili`}
                          >
                            <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
                          </a>
                        )}
                        {member?.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rounded-md p-2 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label={`${member.name} LinkedIn profili`}
                          >
                            <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Second row - 2 members */}
          {secondRowMembers.length > 0 && (
            <div className="flex justify-center gap-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-2xl w-full">
                {secondRowMembers.map((member, index) => (
                  <Card key={index + 2} className="overflow-hidden gap-0">
                    <div className="p-2">
                      <AspectRatio ratio={1/1} className="bg-muted rounded-md overflow-hidden">
                        <div className="flex h-full w-full items-center justify-center bg-background">
                          {member?.image && !member.image.includes("placeholder") ? (
                            <Image 
                              src={member.image}
                              alt={`${member.name} fotoğrafı`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FontAwesomeIcon icon={faUsers} className="h-12 w-12 text-muted-foreground/50" />
                          )}
                        </div>
                      </AspectRatio>
                    </div>
                    
                    <CardHeader className="px-4 pt-4 pb-2">
                      <CardTitle className="text-xl">{member?.name}</CardTitle>
                      <CardDescription className="font-medium text-primary">
                        {member?.role}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="px-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {member?.department}
                      </p>
                      
                      <div className="flex gap-3">
                        {member?.github && (
                          <a 
                            href={member.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rounded-md p-2 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label={`${member.name} GitHub profili`}
                          >
                            <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
                          </a>
                        )}
                        {member?.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rounded-md p-2 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label={`${member.name} LinkedIn profili`}
                          >
                            <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Third row - remaining members (up to 3) */}
          {thirdRowMembers.length > 0 && (
            <div className="flex justify-center gap-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full">
                {thirdRowMembers.map((member, index) => (
                  <Card key={index + 4} className="overflow-hidden gap-0">
                    <div className="p-2">
                      <AspectRatio ratio={1/1} className="bg-muted rounded-md overflow-hidden">
                        <div className="flex h-full w-full items-center justify-center bg-background">
                          {member?.image && !member.image.includes("placeholder") ? (
                            <Image 
                              src={member.image}
                              alt={`${member.name} fotoğrafı`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FontAwesomeIcon icon={faUsers} className="h-12 w-12 text-muted-foreground/50" />
                          )}
                        </div>
                      </AspectRatio>
                    </div>
                    
                    <CardHeader className="px-4 pt-4 pb-2">
                      <CardTitle className="text-xl">{member?.name}</CardTitle>
                      <CardDescription className="font-medium text-primary">
                        {member?.role}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="px-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {member?.department}
                      </p>
                      
                      <div className="flex gap-3">
                        {member?.github && (
                          <a 
                            href={member.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rounded-md p-2 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label={`${member.name} GitHub profili`}
                          >
                            <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
                          </a>
                        )}
                        {member?.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rounded-md p-2 hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label={`${member.name} LinkedIn profili`}
                          >
                            <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Zaman Çizelgesi - Başarılar ve Etkinlikler */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="mb-12 mx-auto text-center max-w-3xl">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">{pageContent.timeline.title}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {pageContent.timeline.description}
            </p>
          </div>
          
          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow">
                      <FontAwesomeIcon icon={faCalendar} className="h-6 w-6 text-primary" />
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div className="h-full w-px bg-border/60" />
                    )}
                  </div>
                  
                  <div className="pb-8 relative">
                    <span className="mb-1 block text-sm text-primary font-medium">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Çalışma Alanları */}
      <section className="container py-8">
        <div className="mb-12 mx-auto text-center max-w-3xl">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">{pageContent.focusAreas.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {pageContent.focusAreas.description}
          </p>
        </div>
        
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FontAwesomeIcon icon={area.icon} className="h-5 w-5" />
                </div>
                <CardTitle>{area.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {area.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Katılım Çağrısı */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">{pageContent.cta.title}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl mb-8">
            {pageContent.cta.description}
          </p>
          
          <Link
            href={pageContent.cta.href} 
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-primary shadow transition-colors hover:bg-white/90"
          >
            {pageContent.cta.buttonText}
          </Link>
        </div>
      </section>
    </main>
  );
}