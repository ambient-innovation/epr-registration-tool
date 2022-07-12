import { RichText } from './RichText'

export default {
  title: 'Common/RichText',
  component: RichText,
}

export const Default = (args: Omit<RichText, 'ref'>): React.ReactElement => {
  return <RichText {...args} />
}
Default.args = {
  html: `
<h3>Dies ist eine H3</h3>
<p>
Er hörte leise Schritte hinter sich. Das bedeutete nichts Gutes. 
Wer würde ihm schon folgen, spät in der Nacht und dazu noch in dieser engen 
Gasse mitten im übel beleumundeten Hafenviertel? 
<a href="https://www.ambient.digital">
Das ist ein externer Link, denn er hat eine absolute URL
</a>
Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute 
verschwinden wollte!
</p>
<h3>Dies ist noch eine H3</h3>
<p>Hatte einer seiner zahllosen Kollegen dieselbe Idee gehabt, ihn beobachtet 
und abgewartet, um ihn nun um die Früchte seiner Arbeit zu erleichtern? 
<a href="/about">Das ist ein interner Link, denn er hat eine relative URL</a>
Oder gehörten die Schritte hinter ihm zu einem der unzähligen Gesetzeshüter 
dieser Stadt, und die stählerne Acht um seine Handgelenke würde gleich 
zuschnappen? Er konnte die Aufforderung stehen zu bleiben schon hören.
</p>
<p>Gehetzt sah er sich um. Plötzlich erblickte er den schmalen Durchgang. 
Blitzartig drehte er sich nach rechts und verschwand zwischen den beiden 
Gebäuden.
</p>
<ul>
<li>List item 1</li>
<li>List item 2Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute 
verschwinden wollte!</li>
</ul>
<h3>Und noch eine H3</h3>
<h4>Überraschung! Das ist eine H4</h4>
<ol>
<li>List item 1</li>
<li>List item 2Gerade jetzt, wo er das Ding seines Lebens gedreht hatte und mit der Beute 
verschwinden wollte!</li>
</ol>
<p>Gehetzt sah er sich um. Plötzlich erblickte er den schmalen Durchgang. 
Blitzartig drehte er sich nach rechts und verschwand zwischen den beiden 
Gebäuden.
</p>
`,
}
