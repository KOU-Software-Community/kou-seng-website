import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faUser, faCalendar, faTrophy, faCode, faExternalLinkAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faKaggle, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { TeamDetail as TeamDetailType } from '@/lib/teamData';

interface TeamDetailProps {
  team: TeamDetailType | null;
  error?: string;
}

export default function TeamDetail({ team, error }: TeamDetailProps) {
  if (error || !team) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle>Takım Bulunamadı</CardTitle>
              <CardDescription>
                {error || 'Belirtilen takım bilgileri bulunamadı.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/">
                <Button variant="outline">
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktif':
      case 'yayınlandı':
      case 'tamamlandı':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'geliştirme':
      case 'araştırma':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getResultColor = (result: string) => {
    if (result.includes('1.')) return 'text-yellow-600 dark:text-yellow-400';
    if (result.includes('2.')) return 'text-gray-600 dark:text-gray-400';
    if (result.includes('3.')) return 'text-amber-600 dark:text-amber-400';
    return 'text-muted-foreground';
  };

  return (
    <main className="flex flex-col gap-0 pt-10">
      {/* Header Section */}
      <section className="container pb-10">
        <div className="mb-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              {team.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {team.description}
            </p>
          </div>
        </div>
      </section>

      {/* Leader Message */}
      <section className="container pb-16">
        <Card className="max-w-4xl mx-auto gap-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-primary" />
              {team.leaderMessage.title}
            </CardTitle>
            <CardDescription>
              {team.leaderMessage.author} - {team.leaderMessage.role}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {team.leaderMessage.content}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Team Members */}
      <section className="container pb-16">
        <div className="mb-12 mx-auto text-center max-w-3xl">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Takım Sorumluları</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Takımımızın yönetiminden ve kordinasyonundan sorumlu üyelerimiz.
          </p>
        </div>

        <div className="mx-auto max-w-6xl flex flex-wrap justify-center gap-6 md:gap-8">
          {team.members.map((member, index) => (
            <Card key={index} className="overflow-hidden gap-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-sm">
              <div className="p-2">
                <AspectRatio ratio={1 / 1} className="bg-muted rounded-md overflow-hidden">
                  <div className="flex h-full w-full items-center justify-center bg-background">
                    {member.image && !member.image.includes("placeholder") ? (
                      <Image
                        src={member.image}
                        alt={`${member.name} fotoğrafı`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-muted">
                        <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </AspectRatio>
              </div>
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
                <p className="text-sm text-muted-foreground">{member.department}</p>
              </CardHeader>
              <CardContent className="px-4 pt-0">
                {member.skills.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Yetenekler:</p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        +{member.skills.length - 3}
                      </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  {member.github && (
                    <Link href={member.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className='cursor-pointer'>
                        <FontAwesomeIcon icon={faGithub} className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  {member.kaggle && (
                    <Link href={member.kaggle} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className='cursor-pointer'>
                        <FontAwesomeIcon icon={faKaggle} className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  {member.linkedin && (
                    <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className='cursor-pointer'>
                        <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements */}
      {team.achievements && team.achievements.length > 0 && (
        <section className="container pb-16">
          <div className="mb-12 mx-auto text-center max-w-3xl">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Başarılarımız</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Takımımızın kazandığı ödüller ve başarılar.
            </p>
          </div>

          <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.achievements.map((achievement, index) => (
              <Card key={index} className="gap-2 py-4">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                    <FontAwesomeIcon icon={faTrophy} className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faCalendar} className="h-3 w-3" />
                    {achievement.event} • {new Date(achievement.date).toLocaleDateString('tr-TR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Competitions */}
      {team.competitions && team.competitions.length > 0 && (
        <section className="container pb-16">
          <div className="mb-12 mx-auto text-center max-w-3xl">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Katıldığımız Yarışmalar</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Takımımızın katıldığı yarışmalar ve elde ettiği dereceler.
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            {team.competitions.map((competition, index) => (
              <Card key={index} className="py-4">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{competition.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        <FontAwesomeIcon icon={faCalendar} className="h-3 w-3 mr-1" />
                        {new Date(competition.date).toLocaleDateString('tr-TR')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {competition.description}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className={`text-lg font-semibold ${getResultColor(competition.result)}`}>
                        {competition.result}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {team.projects && team.projects.length > 0 && (
        <section className="container pb-16">
          <div className="mb-12 mx-auto text-center max-w-3xl">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Projelerimiz</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Takımımızın geliştirdiği projeler ve çalışmaları.
            </p>
          </div>

          <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
            {team.projects.map((project, index) => (
              <Card key={index} className="gap-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FontAwesomeIcon icon={faCode} className="h-4 w-4 text-primary" />
                        {project.title}
                      </CardTitle>
                      <span className={`inline-block px-2 py-1 text-xs rounded-md mt-2 ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Teknolojiler:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {project.github && (
                      <Link href={project.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className='cursor-pointer'>
                          <FontAwesomeIcon icon={faGithub} className="mr-2 h-3 w-3" />
                          GitHub
                        </Button>
                      </Link>
                    )}
                    {project.demo && (
                      <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className='cursor-pointer'>
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2 h-3 w-3" />
                          Demo
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}