#!/usr/bin/env python3
# Helper functions
def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")

def p(t): return f"        {{ type: 'paragraph', text: '{esc(t)}' }},"
def d(): return "        { type: 'divider' },"
def q(t): return f"        {{ type: 'pullquote', text: '{esc(t)}' }},"
def ltr(t): return f"        {{ type: 'letter', text: '{esc(t)}' }},"

def chapter(id_, part, partTitle, num, title, teaser, wc, rt, content, special=None):
    lines = ["    {"]
    lines.append(f"      id: '{id_}',")
    lines.append(f"      part: {part},")
    lines.append(f"      partTitle: '{esc(partTitle)}',")
    lines.append(f"      chapterNumber: {num},")
    lines.append(f"      title: '{esc(title)}',")
    lines.append(f"      teaser: '{esc(teaser)}',")
    lines.append(f"      wordCount: {wc},")
    lines.append(f"      readTimeMinutes: {rt},")
    if special:
        lines.append(f"      specialTreatment: '{special}',")
    lines.append("      content: [")
    lines.extend(content)
    lines.append("      ],")
    lines.append("    },")
    return "\n".join(lines)

PROLOGUE = chapter(
    "prologue", 1, "From Meeting to Proposal", 0, "Prologue",
    "The room is exactly the same. Same walls. Same window.", 680, 3,
    [
        p("Now."),
        p("The room is exactly the same."),
        p("Same walls. Same window. Same pale morning light that falls across the floor at exactly the angle it always did. The coffee is brewing in the kitchen. Two cups, like always \u2014 one habit that never died even when the reason for it did."),
        p("On the wooden shelf beside my drawing table, three things sit in a row:"),
        p("A pair of small gold earrings, the kind that catch light and turn it into something lovely."),
        p("A thin silver bracelet, its clasp slightly worn from being undone and fastened too many times to count."),
        p("A purple scarf, neatly folded, still carrying the faintest trace of a perfume I have not been able to name \u2014 only remember."),
        p("People who visit this room sometimes ask about these things. I always say the same thing: they belong to someone."),
        p("They belonged to Palak."),
        d(),
        p("I am Aarav. I am thirty-four years old. I am an architect. I design houses for people \u2014 spaces meant for living, for laughing, for the ordinary and extraordinary collisions of a shared life. I am very good at my work."),
        p("But the only house I ever truly wanted to build... I never got to finish."),
        q("We spend our whole lives building walls to protect ourselves, not realizing that love never knocks on doors \u2014 it simply finds the cracks."),
        p("This is her story. And mine. And the strange, beautiful, heartbreaking place where they became the same story for a while."),
        p("Four years ago, at a wedding neither of us planned to matter, I saw a girl in a black dress standing beside the woman my best friend had just married. She was not doing anything remarkable. She was just standing there, tucking a strand of hair behind her ear, looking at the stage with something between boredom and quiet happiness on her face."),
        p("And my whole world rearranged itself."),
        p("Just like that."),
        q("Some moments do not announce themselves. They do not come wrapped in significance. They arrive in the middle of ordinary things \u2014 a wedding, a table, a forgotten pair of earrings \u2014 and only later do you understand that this was the moment your life divided into before and after."),
        p("Before her. And after."),
        p("Her name was Palak. She had ocean blue eyes that I thought I had imagined, until the second time I looked. She laughed with her whole face. She forgot things \u2014 earrings, bracelets, scarves \u2014 as if she was always leaving small pieces of herself behind for the world to find."),
        p("I found them. I kept every single one."),
        p("I did not know then that she was doing the same with time. Leaving pieces of it behind. Slowly, invisibly, beautifully \u2014 until there was none left."),
        p("But I am getting ahead of myself."),
        p("Let me begin where all the best stories begin."),
        p("At a wedding. In the light. When I first saw her."),
    ],
    special="prologue"
)

CH1 = chapter(
    "chapter-1", 1, "From Meeting to Proposal", 1, "The Wedding",
    "India in December has a particular kind of warmth.", 1240, 6,
    [
        p("India in December has a particular kind of warmth."),
        p("Not the brutal summer heat I had half-remembered from my last visit years ago, but something gentler \u2014 cool mornings, golden afternoons, evenings that felt like old songs. I had been living in the United States for nearly five years. I had built a career there, a company, a life that looked impressive from every angle I photographed it from. But when I landed at the airport and stepped into that particular Indian smell of marigolds and diesel and something warm and familiar that has no name, I felt something unknot in my chest that I had not realized was tied."),
        p("I had come for Nikhil's wedding."),
        p("Nikhil \u2014 my best friend since we were eight years old, when we sat next to each other in class and he had quietly slid his exam answers toward me because I had forgotten to study. We had been inseparable since. He knew the worst things about me. I knew all of his. That is the particular intimacy of childhood friendships: they are made before you know enough to be careful about what you reveal."),
        p("He did not know I was coming. No one did. I had booked the tickets on a Tuesday night, flying economy across fourteen time zones, because the idea of Nikhil standing at that altar without me there was something I could not justify to myself."),
        q("Loyalty is not always loud. Sometimes it is a red-eye flight and a suit bought in a hurry because someone you love is having the best day of his life."),
        p("I arrived the morning of the ceremony. I remember standing outside the wedding hall for a moment, listening to the music floating through the walls \u2014 dhol, brass, the particular joyful chaos of a North Indian wedding \u2014 and feeling something close to peace. The city was decorated. Lights strung between buildings like constellations brought down to street level. Marigold garlands everywhere. The smell of food being cooked in enormous quantities somewhere nearby."),
        p("I had brought two suits. Black, both of them. One for Nikhil \u2014 a surprise, since he had mentioned once, years ago, that he had always wanted a proper black suit for his wedding. I had remembered. The other for myself."),
        p("I walked in."),
        p("The hall went briefly quiet when people recognized me, and then broke into a wave of noise. My parents, who had known I might come but hadn't been sure, found me first. My mother held my face between her hands for a long moment, the way she always did, checking if I had been eating properly, finding the answer unsatisfactory."),
        p("And then Nikhil saw me."),
        p("I will not try to describe a grown man's face when he sees his best friend at his own wedding after years of separation. I will only say that there are moments that make all the distance and all the waiting feel worthwhile, and this was one of them."),
        p("He grabbed the microphone from the DJ and made an announcement that embarrassed me completely and made everyone in the room cheer, and I stood there in my black suit trying not to smile too obviously and failing entirely."),
        p("After the introductions, after the photographs and the blessings and my mother being interrogated by aunties about why I was still unmarried, Nikhil and I went to change into fresh clothes for the evening rituals. We talked the way old friends do \u2014 quickly, without preamble, jumping between years as if time were just a mild inconvenience."),
        p('"She\'s wonderful, Aarav," he said, meaning his new wife, Priya. "You\'ll love her."'),
        p('"I already do," I said. "Anyone who chose you deserves a medal and our eternal admiration."'),
        p('He laughed. "Idiot."'),
        p("We went back to the hall."),
        p("And that is when I saw her."),
        d(),
        p("She was standing beside Priya \u2014 Nikhil's new wife \u2014 near the edge of the stage."),
        p("She was wearing a black dress. Simple, elegant, the kind of dress that does not try too hard and precisely because of that, succeeds completely. Her hair was loose, falling to just below her shoulders. She was saying something to Priya that made Priya laugh, and while Priya laughed, this girl \u2014 I did not know her name yet \u2014 looked off to the side with a small, private smile, as if she was enjoying the effect of whatever she had said more than the attention of anyone watching."),
        p("She had a quality of stillness about her in that moment. Not coldness \u2014 warmth, actually, a warm kind of stillness, the way a candle is still but also alive."),
        p("I noticed her earrings first. Small gold ones, catching the light from the stage. Then her eyes \u2014 and my God, her eyes. Even from across the room I could see they were an unusual colour. Not quite brown, not quite green. Later I would decide they were the colour of the ocean on an overcast day. Blue, but with depth. Blue that meant something."),
        q("There are some faces you see and something in you says \u2014 not a word, not even a thought \u2014 just a quiet, certain yes. As if the heart recognizes what the mind has not yet had time to understand."),
        p("The noise of the hall faded. Not entirely \u2014 I was not so far gone as to hallucinate silence \u2014 but it receded, became background, became less important than this girl standing across the room in a black dress with a private smile and ocean-blue eyes."),
        p("I do not know how long I stood there looking. Long enough that Nikhil appeared at my elbow and followed my gaze and then looked back at me with an expression I recognized as the one he made when he was trying very hard not to laugh."),
        p('"That\'s Palak," he said.'),
        p('"Palak," I repeated, as if testing the weight of it.'),
        p('"Priya\'s best friend. They\'ve known each other since college." He paused. "She\'s very intelligent. And she has excellent taste."'),
        p('"How do you know she has excellent taste?"'),
        p('"She hasn\'t looked at her phone once tonight. She\'s actually present." He shrugged. "Rare quality."'),
        p("He was right. In a hall full of people performing their presence for photographs, she was simply there. Watching. Laughing. Existing without commentary."),
        p('"Come," Nikhil said, and before I could compose myself into anything resembling casual, he was walking toward them.'),
        d(),
        p('"Palak, this is Aarav. My best friend. The one I\'ve been telling Priya about for years."'),
        p("She turned to look at me."),
        p("Up close, her eyes were even more remarkable. There was an intelligence in them \u2014 quick, warm, slightly amused, as if she was already deciding what kind of person I was and finding the result acceptable but not yet conclusive."),
        p("She extended her hand."),
        p("I shook it."),
        p("Her handshake was firm. Not the polite, barely-there version some people offer. She shook hands like she meant it."),
        p('"Nice to meet you," she said.'),
        p('"Nice to meet you too," I said.'),
        p("And I meant it more than I had meant any five words in recent memory."),
        p("We stood for a moment in the particular awkward silence that follows introductions at weddings, the silence where you are both aware that you are being watched by the couple who introduced you and have their own theories about what this meeting means."),
        p('Then she said, "You came from America?"'),
        p('"Yes. Surprise visit."'),
        p('She smiled. "Nikhil didn\'t know?"'),
        p('"No one knew."'),
        p('"That\'s either very romantic or very cruel, depending on how good his heart is."'),
        p('I laughed \u2014 a real laugh, the unexpected kind. "He\'s fine. He cried a little. Don\'t tell him I told you."'),
        p("She laughed too. And I thought: there it is. There's the full version of that smile. And I was absolutely, comprehensively done for."),
        q("Laughter is the shortest distance between two strangers. And sometimes, in the space of one shared laugh, two people quietly stop being strangers without either of them noticing."),
        p("We danced later \u2014 all of us together, the way weddings demand. She danced with the same quality she had while standing: fully present, not performing. She moved to the music because the music was worth moving to, not because anyone was watching."),
        p("I watched her when I thought she wasn't looking."),
        p("She watched me when she thought I wasn't."),
        p("We were both looking more often than we admitted."),
        d(),
        p("Late in the evening, when the formal rituals were winding down and people were collecting their things from tables, I noticed something."),
        p("On the table near the stage, beside an empty glass and a crumpled napkin, sat a pair of small gold earrings."),
        p("Her earrings."),
        p("She had taken them off at some point \u2014 perhaps they had been uncomfortable, perhaps she had simply forgotten she was wearing them \u2014 and set them down and walked away without them."),
        p("I picked them up."),
        p("I held them in my palm for a moment. They were warm from her skin. Small and gold and ordinary and somehow, in that moment, the most significant objects in the room."),
        p("I should have gone after her immediately, called her name, returned them."),
        p("Instead I stood there for a moment, thinking something I would not have been able to articulate clearly, something that was less a thought and more a feeling: keep them."),
        p("Not forever. Not as theft. But as \u2014 something. A reason. A thread."),
        q("Destiny does not always arrive in grand gestures and dramatic declarations. Sometimes it arrives as something small that you pick up from a table and slip into your pocket, telling yourself you will return it soon \u2014 knowing, somewhere beneath the thought, that you are already in the middle of a story you did not plan to enter."),
        p("I put them in my pocket."),
        q("He kept all the things she forgot. Not knowing that one day, she would be the one thing he could never keep."),
    ],
    special="wedding"
)

CH2 = chapter(
    "chapter-2", 1, "From Meeting to Proposal", 2, "The Farewell \u2014 and After",
    "When it was time for Priya to leave with Nikhil, the women who had known her longest began to cry.", 920, 5,
    [
        p("When it was time for Priya to leave with Nikhil, the women who had known her longest began to cry."),
        p("This is one of the things I have always found both beautiful and unbearable about Indian weddings \u2014 the farewell. The bride's side weeping. The groom's side waiting. The particular quality of grief that is not grief exactly but the acknowledgment that something has changed, that a chapter has closed even as a new one opens."),
        p("Priya's mother was inconsolable. Her younger cousin was clinging to her arm. Even the woman who had been managing the decorations was dabbing at her eyes."),
        p("Palak was standing among them, and she was crying too \u2014 not loudly, not dramatically, but with the quiet, real quality of someone who genuinely loved the person leaving."),
        p("I found myself walking toward the group."),
        p('"Please," I said, and they all looked at me \u2014 this man in a black suit who had appeared from America without warning, now inserting himself into this most tender of moments. "You are not sending her to a random place, to a random person. I have known Nikhil since we were eight years old. I know him better than anyone in this room. He will take care of her like she is the most precious thing in his life \u2014 because she is." I paused. "And uncle and aunty will treat her like their own daughter. She is not just Nikhil\'s wife. She is already my elder sister. Don\'t worry. If something ever goes wrong, I am also there."'),
        p("I had perhaps slightly overcommitted. But I meant every word."),
        p("The crying did not stop exactly, but it changed quality \u2014 became softer, more accepting. Some people laughed through their tears."),
        p("I caught Palak's eyes across the group."),
        p("She was looking at me with an expression that I could not entirely read \u2014 something between surprise and something else, something warmer, something she tucked away quickly when she realized I had noticed."),
        p('I leaned slightly toward her and said, quietly enough that only she could hear: "Please don\'t cry. Pretty girls shouldn\'t cry."'),
        p("She looked down immediately. A flush of colour along her cheekbones. A smile she was clearly fighting."),
        p('"And if you keep crying," I added, "we\'ll have to take you with us."'),
        p("She laughed out loud. So did several people nearby who had heard. Nikhil, standing at the car, caught my eye and raised an eyebrow with a look that said: really?"),
        p("I shrugged."),
        q("Humour is not the opposite of emotion. It is sometimes the only way to honour how deeply you feel without drowning in it."),
        p("In the car, on the way back, I sat in the front seat driving while Nikhil and Priya sat in the back. The night had that particular Indian quality \u2014 warm despite the December chill, the streets still full of life even at this hour, the kind of night that feels like it should be the setting of something important."),
        p("I glanced in the rearview mirror and found Priya looking at me with a knowing expression."),
        p('"So," she said. "Palak."'),
        p('"What about Palak?"'),
        p('"You like her."'),
        p('"I just met her."'),
        p('"Aarav. I watched you watch her for three hours. You forgot to eat dinner."'),
        p("I had, in fact, forgotten to eat dinner. I had not noticed until this moment."),
        p('"She\'s very nice," I said, with great dignity.'),
        p("Nikhil made a sound that was somewhere between a cough and a laugh."),
        p('"Will she come to the reception?" I asked, trying and failing to sound casual.'),
        p('Priya paused. A beat too long. "Hmm. Maybe not. She might be busy."'),
        p("My heart sank slightly."),
        p("In the back seat, visible in the mirror, Priya met Nikhil's eyes. He pressed his lips together, suppressing a smile. She had already invited Palak. She was enjoying this enormously."),
        p("I drove home through the December night, one hand on the wheel, the other in my jacket pocket where two small gold earrings sat quietly in the dark."),
        q("The things we carry in our pockets are often the things we are not yet ready to admit we want to keep."),
    ]
)

CH3 = chapter(
    "chapter-3", 1, "From Meeting to Proposal", 3, "The Reception \u2014 and the Dinner",
    "The next day I worked. I thought about Palak three times before lunch.", 1100, 5,
    [
        p("The next day I worked."),
        p("I had brought my laptop from the US along with a significant backlog of project deadlines that did not care about weddings or ocean-blue eyes. I sat in my old room at my parents' house \u2014 the same room I had grown up in, now slightly strange with adult eyes \u2014 and worked through the morning and into the afternoon."),
        p("I was good at concentration. Architecture requires it. You must be able to disappear into a design, to think spatially, to hold a building in your mind and walk through it while sitting still. I was known for my focus."),
        p("I thought about Palak three times before lunch."),
        p("This was, by my standards, completely unreasonable."),
        p("The reception was in the evening. I dressed carefully \u2014 more carefully than the occasion strictly required \u2014 and arrived early to help with the arrangements. By nine o'clock the formal programme had wound down and guests were drifting between the food tables and the small clusters of conversation that form whenever Indians gather in sufficient numbers."),
        p("And then a car pulled up outside."),
        p("And Palak stepped out of it."),
        d(),
        p("I had moved toward the entrance before I fully registered that I was doing it. She was wearing a different outfit tonight \u2014 deep green, traditional, with gold at the edges \u2014 and her hair was pulled back, and she had small flowers threaded into it, and she looked at me as she got out of the car with an expression of pleased surprise."),
        p('"You came," I said.'),
        p('"I was invited," she said.'),
        p('"Priya said you might be busy."'),
        p('"Priya said no such thing. Priya invited me last week." She looked past me to where Priya was standing near the stage, watching us with undisguised delight. "I think she may have misled you slightly."'),
        p("I turned to look at Priya. Priya waved cheerfully."),
        p('"I see," I said.'),
        p('"Were you worried?"'),
        p('I considered my options. "I was professionally focused and entirely unaffected."'),
        p('She laughed. "Of course you were."'),
        d(),
        p("The evening moved the way good evenings do \u2014 quickly, in a warm blur. I found myself near Palak often. Not in an obvious way, not following her, but in the natural, gravitational way that happens when two people keep choosing to be in the same room and then finding each other in it."),
        p("Around nine o'clock I noticed she hadn't eaten."),
        p('"Wait here," I said. "Give me two minutes."'),
        p("I went to the food table and made two plates. The same things on both \u2014 because I realized, standing there, that I had no idea what she liked and had chosen based on what I liked, which was presumptuous and probably saying something about me that I didn't want to examine too closely."),
        p("I came back, set the plates down, pulled out her chair."),
        p("She looked at the chair. Then at me. Then at the plate."),
        p('"For this you asked me to wait two minutes?"'),
        p('"You hadn\'t eaten. Neither had I. Priya would be upset if her best friend fainted at her reception. I am senior management here and this falls under my responsibilities."'),
        p('She sat down, shaking her head with a smile. "Senior management."'),
        p('"I made an announcement." I sat across from her. "It counts."'),
        p('She took a bite. Looked up. "This is good."'),
        p('"I have excellent taste."'),
        p('"In food."'),
        p('"In everything." I paused, looking at her. "Don\'t believe me? Look around."'),
        p('She caught the implication, and a warmth came into her face that she redirected immediately toward her plate, busying herself with the food. "You\'re very smooth, you know that?"'),
        p('"I\'m very sincere," I said. "That\'s different."'),
        p("She looked up again. Studied me for a moment with those ocean-blue eyes, deciding something."),
        p('"You\'re not what I expected," she said.'),
        p('"What did you expect?"'),
        p('"Someone more\u2026 polished. More American. Nikhil said you ran your own company."'),
        p('"I do."'),
        p('"People who run companies usually seem like they\'re always running somewhere."'),
        p('"I\'m sitting here eating food with you. I\'m not running anywhere."'),
        p('She smiled slowly. "No. You\'re not."'),
        q("The greatest thing you can give another person is not your time, not your money, not even your heart \u2014 it is your full, undivided presence. In a world that is always rushing somewhere, the person who stops and stays is the rarest person of all."),
        p("We talked for a long time that night. About her work, her plans, her city. About architecture, about how buildings could carry emotion \u2014 how the angle of a window could change the feeling of a room entirely, how space was never neutral, how the places we lived in shaped us and we shaped them back. She was interested in everything I said and pushed back on several things and was right about half of them, which I found more interesting than if she had simply agreed."),
        p("She had taken off her bracelet while eating \u2014 a thin silver one \u2014 and set it on the table beside her plate. And at the end of the evening, when we said goodnight and she walked to the car that was waiting, she left without it."),
        p("I picked it up."),
        p("In my pocket: two gold earrings, one silver bracelet."),
        p("I was keeping things of hers now. Plural. This was beginning to look less like coincidence and more like intention, and I wasn't sure which of us was doing it."),
        q("Some people leave things behind without meaning to. And some people find those things and hold them \u2014 not because they are lost, but because they feel like a beginning. Some hearts leave small pieces of themselves everywhere they go \u2014 not carelessly, but the way flowers leave petals, as if they know, somehow, that beauty is better scattered than hoarded."),
    ]
)

if __name__ == "__main__":
    print("Part A loaded: Prologue, Ch1, Ch2, Ch3")
    print(f"  Prologue lines: {len(PROLOGUE.splitlines())}")
    print(f"  Ch1 lines: {len(CH1.splitlines())}")
    print(f"  Ch2 lines: {len(CH2.splitlines())}")
    print(f"  Ch3 lines: {len(CH3.splitlines())}")
