# Zygor's guides UI

An app made to streamline the process of creating guides for the ZygorGuidesViewer 3.3.5a addon ([Link to Felbite.com](https://felbite.com/addon/4698-zygorguides/)). I used it to build [my guide for the Project Epoch launch](https://github.com/JNP-7/epoch-jubis-zygor-guide)

Built with:

  * Electron + Vite
  * React
  * React-Bootstrap

<img width="1205" height="846" alt="imagen" src="https://github.com/user-attachments/assets/69632dc7-aea8-458b-8470-a854fae9126b" />

# Table of contents

  * [More info & How to use](#more-info--how-to-use)
    * [Creating a guide](#creating-a-guide)
      * [Sections](#sections)
      * [Steps](#steps)
      * [Tasks](#tasks)
      * [Generating the guide](#generating-the-guide)
    * [Utilities (WAs and macros)](#utilities-was-and-macros)
      * [Quest log history](#quest-log-history)
      * [Location](#location)
      * [NPCs ids](#npcs-ids)
  * [Suggestions for making a guide](#suggestions-for-making-a-guide)
  * [Ho to build the app](#how-to-build-the-app)

## More info & How to use

To summarize in 2025 terms. ZygorGuidesViewer 3.3.5a is the baby version of the RestedXP addon.

Using most of the important rules and patterns provided by the "guide_format.html" file inside the ZygorGuidesViewer addon the app allows the user, through an UI, to create, edit, store and share guides for said addon.

The editor allows the user to create guides divided in sections which display a series of steps with a set of tasks to complete. The addon then uses the generated files to display the guide's information ingame and advance through the steps and sections as their respective tasks are completed.

<img width="651" height="429" alt="Captura de pantalla 2025-07-23 232742" src="https://github.com/user-attachments/assets/b244db5c-ed10-4ff1-b663-c31bd02219d5" />

### Creating a guide

Upon opening the app a menu will appear with 3 options:

 * Edit an existing guide: resume editing a previously saved guide.
   * Uses the .json files that the users can store and share.
 * Import from raw LUA: imports a logged quest history from your game's saved variables.
   * More about this in the [utilities section](#utilities-was-and-macros).
 * Create a new one: create a guide from scratch.

Once an option is choosen, the user can begin editing the guide. By clicking on the save icon it's possible to generate a .json file that contains the current guide's status for further editing or sharing.

#### Sections

After adding some misc. info about the author and the guide's name it's time to begin entering data. Firstly add a new section and give it a name. The "Section level" is only used within the app, so it can be left empty. You will notice 2 extra fields:

 * Next section: links this section to another one. Once all the steps in this section are completed the guide will advance to the pointed section.
 * Default for race: if the player's race was designated as a section's default race the guide will begin on said section when it's loaded. Can be useful if your guide covers multiple starting areas that then coalesce into a particular section.

#### Steps

Steps are sets of task that advance from one to another once a given step's tasks are completed. Upon completing all the steps in a section, the guide advances to the next one.

Besides adding, deleting and/or ordering steps, you can:

  * Clone a step to add it after another one.
  * Delete a group of steps and/or move them to another of the guide's sections.
    * The later is particullary useful when working with the option "Import from raw LUA". The moved steps will appear at the end's of the choosen section.
  * Designate a step so it only shows up in game for one or multiple classes. Useful for class quests.

<img width="1059" height="703" alt="Captura de pantalla 2025-07-24 234700" src="https://github.com/user-attachments/assets/d1c74be2-12c9-4489-ab88-01814dc767ee" />

#### Tasks

Tasks set the objectives that must be fullfilled to advance from one step to another.

The possible types of tasks that can be created as of now are:

  * Comment: shows some text.
    * Can also add and interactive icon to use an item.
  * Goto: shows some text and points the addon compass to a set of coordinates in a zone.
    * Can also add and interactive icon to use an item.
  * Accept/Turn in quest: instructs the addon to Accept or Turn in a quest when interacting with an NPC/game object/item that starts/ends a quest.
    * If the auto accept/turn in feature of the addon is turned on in game the addon will try to accept/turn in automatycally.
  * Kill: to keep track of kill quest objectives.
  * Get: to keep track of gathering quest objectives.
    * Can also add which mobs drop the item, which will then show, in game, when the players reads the tooltip for the mobs.
  * Goal: every other quest objective (discover, escort, etc).

Note that not every possible rule described in "guide_format.html" can be added through the app. You could add them if you wish to after generating the files.

A task can be a subtask from another one. This has no functional effect in game, but it displays the information on a more strucutred manner in the addon.

Once the type of the task is choosen the user may edit the data about that step's type. For example: the id and name of the quest that should be accepted. Additionally, an "advanced" section is available. That section contains the current task's data in JSON format which can then be copied and pasted to/from another task of the same type. More about this in the [utilities section](#utilities-was-and-macros).

As for the "custom" switch. This will mark that step to be generated as a formatted step of type comment instead of its choosen type. It has an effect when one of the three modes in which the guide's file [can be generated](#generating-the-guide) is selected.

#### Generating the guide

To generate the guide's file click on "Build guide" at the top of the screen. Three options will appear

<img width="553" height="291" alt="imagen" src="https://github.com/user-attachments/assets/1e97de5a-f2eb-47ff-ad7b-7297761c518e" />

  * Full: every task of a step is generated following the guidelines in "guide_format.html" for their selected type. This makes use of all the addon's functionalities.
  * Custom tasks to text: the taks marked as "custom" will be generated as a formatted step of type comment instead of its choosen type. This option is there because at some point during development the Project Epoch devs announced that the ids for custom quests, items and NPCs would change. In that case, the custom tasks from the "Full" option would have been incorrect.
  * Full text guide: everything but Goto tasks become comments.

This will generate a .lua file that can be stored inside the addon to use ingame. More info about how to do this [here](https://github.com/JNP-7/epoch-jubis-zygor-guide?tab=readme-ov-file#how-to-use).

### Utilities (WAs and macros)

Some knowledge about macros, the WoW API and WeakAuras might be required to follow what's explained here.

#### Quest log history

The following WAs will print the information about the quest you just picked/completed in one of the game's chats and in your <wow_folder>/WTF/Account/<acc_name>/SavedVariables/WeakAuras.lua -> WA_QUEST_LOG_HISTORY saved variable. The chat window to which the data is printed to can be changed by modifying the variable "chatFrame" inside the custom event handler for "Trigger 1" of each WA.

Printing the information in one of your chat windows is useful if you are recording gameplay with the purpose of making a guide due to the known bug about the "Import from raw LUA" option.

Accept quest WA
```
!WA:2!vEv3YnUTv444zAA50201x4P)DbcZuxPeTASD2XPz9KlKKL2vDKTuOOT3TRZOfIeucDPiOba9kTzsUqTxKERFe819k)iSpbC80(cSpc5jOhaqklPvBQdhnuGaN)W58DW5G1ASXOn83W)7lWzjYqAeH3(y3wnpQoFC7GabrUgFIzW6xJJ8gY4Dy0iz)A1pYTUtmYNkIdXtCjJL9cy8ryzV4Es6is2xRf)B8ses2iffhh7JLehYfKi5BWjWSyj17uQVCy1kWNCSNKYIe75iKyU8e(iIqGhqE)(gzyBz96SP6jNetC6408i3l9z9mR)8RGHzemSknIk3kDJNN(HJx7FfKePLn60k9(QJR31TxR2pQx3kNu)GENuXPzLQTQ3TqgVfTqWJ(fnaDkb)IkjCSOl(cIp67(sueneHJ8rzKNpLCijsZ0mUxPeEM9c2WJB21TTZtT)A0xUcXOEURSJ(MVD)zmsI8FBB5UjPN9X3rn(PODuQnZnS)I6l3a0V4ezcpYcMRFaexedTMk50bdiCXVElE2WV)EtPsYOJWJiRfFVebP3acaiPEDhYEz7ONFZcF(gH(VAmwOp7LWNj91aRoCsaDSt3o1B16kFs)KGaxaRWFC9wDACCRQkGt6hETbXOHrP)IxRuwUUF(uFyRRalBS7urmjmSPVWYiCXBm(Hk1QvVJB9daS1p7FKJTkqkHoVzKpz8CaOqMhoeDUlvgcl3Bv)oVPp4fFer(vjeHSfBGM4czIY4w7sKhIJDz1s4CWo(BSisHSLmAiMjEsj17NAKvhiRKWbE6WeuT1zhRNYEb2Efii1M2WKdbhQeTkzDrXNajtAZ0gYmhqK2ZVyuSNzTLNntY5ZdPchdY5rh38GcgbwC(0j1AkowETfsiY1LKfLmQpHxqaONObLHWFHLfEPVO0o7wS0o7vC)55pZQwwD7)2W27FFuTHyzdoq2UL(SYLlJAW43o3oia4GoOEJkh3YTxThxXTxdNkhwpNzJJWlNCqP9E0ZSNX(dS)65DyZt3BlZ9xgtnKG9HiSyGYdxXZJelHJN0yO7V4ZcHLagtoJT6hDa6(OvYS9sOlnikJTV5m7XqIh3)m7hISrGBjlkyo0VG9FQ8Ub2LkOaLOpbTZ2BxSOIk7sNzp5oY4txMrpfFcard8EMTM5zO3YLTpZ(BxWKpxTxAgfWU1M1tPOxP9mryYm164m7sOmIAERbQYovRMlD9RzHQhwX3)qZ5FfMfqkH2P82Z)A7mW1pAXNzSNr8k1XCbcq25)UtYFowlMNpwWKo9DQCuDoyE6HEMIlM6nlT(wpAg5Z5pZfWTouTkM5onkCEh67CVA00k2M)F3QgoxkJEL6yEuYpvh688(JfZMLX9tvbZyS4(lxkfj5jzvCvvvNv9RluUJo(6E1QaYSRBfh3QQJ36Bo73jcmnHfuWtDgekZaZRfoK6tCu9U5FzsuwnzR47PAk7cIR57dz(K)97f)hwzFFMbPB)dqhIeEeo8eO(oG4OxIJOJ0Lu3l9x1i9JQgbjUVMGfKUsOC2a5Wp4M8IU6sYCbXJf5lMQOrv(oDVQJW0iG309s)8pi9VK(fPpegU5YZu1Ni8I)VhySpHcbJOqmcXc0J1bn0ewc6Vd7Aum17fWbFjXar6ONolqaT9iqujuLrrkhH98yGp5plUTfkKU3OtWCkUFiqDHv3LuXYixqTArlvV8FllZdhH6RjjAaylGHOws4XPXsLzN56r7unGfjVQ(4yoe4EjEYkddE5HH9QgYW(NCPQ3MiaCWh2xIdbmYMoJscLulhVqSqSz6bwvH2C8mdOVIOgmvPQUWh)U(cWb4r6thfZ4YBedXq7wpj7obxXjdGyMkcvvcgXLcsyG5gcvB762(Wm6FQH()47DfGoj(6w()N)Y4p(DF9byp6rvGN1J)03nv(taen1RNCi4sgcDcoXXJfY4)11HNPVekyCkhhp90SbCvmNgmbYUA4ELK5DHbG(ZV4mBQ)n6YFAibai6daWa6aRRdu5ZaoflXR)dM7aPtXvB6(DR5uV(r3axMbMUDS(6lw7Mq9V(vFENNm(bYcp4G4RNBd8(xB8i10M5ART26xPq66tMfFYwoEdjEVyR0F76tVidAvv1Ol3GoepCZPXCgKGiNuvHPSS2kLyLo06AfuIBsYSUcooWrhze)(nt)OBGp7J9EXa4sEr(BiCEq5TlV9gx8FEY)7d
```

Complete quest WA
```
!WA:2!DI12UTnYz41RVOncTDBmkc6PlMLbXvAxzbB3fPTX7cujBQevizztrBhV2lugrouAsO4WmZqhRDXUxi0l2ERFe819k)iKNacJ2(aKhH8e0)ziLe1bh7wbbQHZ8FA((pmZVwQ6k9xXDf3FmpNfj9PbeEZdSRxBxt(5n98ee5s8bjdw(kCGtpgFpgnq2zBZDTnTcrUurOpEGn5CzBpgVpw2oSTK2NK(2sH)sNiHK1xrXbHUyjXICgjq(oCemlwsDoI6k7vPm8kh7iPSaXJTesmxEiVpriWDjFCNezyKl3BtNQTCqiXApRA7AFHlRDY6V4syykb964rdOIE5Qa)ixnELxe)jNV0)WlkqRd0rLBV)bMTSBxV5tB3Q8HM70(WYw1kxPUzR8PYOqoe8r)G6HoIGFv5iow0cFgXf9dFfkG6JWbUOuYhnLShjqZ0yUxOeoXykB4z1Az306yJVb9vlqmQp3v2rF33V1ygjbUZBl3njDYdVJA8ZrBOuBkmS106BKbOFWjYiEqoyUHsoTBxcx8lwLNo8hV)qQK0FxCFYsH3psqA3LabKuNw9yVPzWlUEQxFNq)Z2mMVl7nbvIa3ChvSiHFPlPtKNNneIWFMz99QEq9kQ4L4p5DIOo6WVwW60ZVQ92LHDtl7Yw2VvPWr6)fxLer1Uh1LyPINDJV3B3UhwIAKSlTcaYe5gkcj((1Cf5gXHwr3BOlaBQaTv2CSo3JtaDA1ApZ61HGX79FgfmMNuenFiNpZb7JE92S(H(ejzpSus4baola8kOBPUGCZBAzL6s2UzJ9QBAB2UvrKXJEKWa(jFP1kyuyRmIRVO7(QnyIyG8pNEJI2loNUs5CucWyE)GX5RTgsHtv5aLBw8pwQujuvgFYCBGaGgTJz1YhuhS6Nv2UDvRYnmZkGeB1zelGX2(PNymweFHX3mjiBEANx2BnVz2IiBGdTzBhX5GV5RzbK8fMvQHmXZlQEEmi2NsK7PdVa(2JjOApNrseNXCS(TGatbAGrlc2xPcvvW5vJk0TMlqPbu2RlrAmlbbHojRVOvs1s21aN1bGmF6b12jFIWlKTELAnfxZU2CvCgPxjliQFhcpFAONkYBwfu8VuCJnluCJhNz7LkJulCw1ElfPsdyvHOGo3xmtHT09FJSRV(KLHJFquyQnkQW)DJ6VFeriRZ6Aga7bIiFbKldnLLo1lPzF2uPpKz0ErFFTgBaPps0AIZtNbaaNrIyuf2hNdnhwRXQP2nzFdkXU1CKpbBojdTZEcWTq9jgjwN(KJKH)VWBn3egR5onxzDPtbUFaFDpc2fsVeDvHZ2WbfWXS0aKgExB6pZLi4XyYX8AU7oO1qlwcglijxNlNY73DQX5WHkC3tnEcYabLVsd6tUqtEJhvAtpJI5v1gqFgAJ1xVqbfvgfp1yWDKXJNLrhfFcOWcW7PgAMhxaPujJtn(EJfudBCrVNu21n9CP8JbXIOnkTE2hRNjW8dE9NXIiddluxzGUIQmTKV3z9KH9czlELpPUZpOkQPlynQgIEMcZN7mUw4eFyklkFrkGosiki)u40rnn1M4TsuQA1SG9nU3t02heKVvairg3qHqvfSxMub7HzQc6YwuDkvaETap2eaqp1mqqM04xMnXFcKKiOjGYSCOt3VZyuwZ6gcqUvmkRmMgPULeHXve()j0CmZfU9RZIK8O0AMQB2MCzpX71x)Orlq2h3Y2SXfrbP3Znx49vn6CgXo59gmxY)8Jc)DlSxQKbXR(EORl4kzy)dH7md5m0leeFVKMXQ002UzJkUeHt4)ENePiuzjqTppgI5PhRbs0awe6LWnvrYXvhHVkauNPjGl6lquyzMIuoc74Wal)piM00as3nWHyof3XhOo)I7lOqjKnOwTOLQhUZzzo4auhnjbDtSf1schonuQm7uacTrfpwG8sZZd5GZ9n4bleSCshujakDwXNHDp8c1L6dahcVxhj2h8lpWQFKVKMZYXhlepi(VMRcCfENKb0VLOgmuPTwWl)MocadCiDO9dzC51IEyOxJNN2q8LCsxWtOAZOIeSJHVbkIFehho8O0bPmCCcd)(p6shwGRUKN4Zw1YPhX5vRg)RxE4zPyzfvpn8e4q8KhmmKZGwyKdQOaXC5wnE3CX7Nl8H3Cx3aa5qvXhlFvgI(ylhMpJ)3wg(CboG2x3AYJJ)5vFlbliTKWvG7k79tI)04V86rDUO7KHlikBwmurNANg)Lv6JPbvJFUM64JJ)64tGF)vZodxfLr9gaPtvTVuYColjW9NE2Pgu3R1hjRdcb3EhqhE0U5UYtLedMdwIx(9j)Fd68ALM70ABltZDVghjHPBgQHXCBgrDVY71NF2Z(tvZ)NRup8ZVzWXDa00g1PTSheg1d6BCWvjoOT1OZslT0YxcDOrC1)Le)9F2vQGuEcyL7s4sVwAhU43(G4p9A41oyNx1LdPhURiS(IsRxA9vo7F98)7
```

You can then extract the values stored in the SavedVariable to another .lua file and use it with the option "Import from raw LUA" during creation to import your entire playthrough.

<img width="1197" height="796" alt="imagen" src="https://github.com/user-attachments/assets/6eb5524a-0ad9-4a2f-afa6-0f17efcc4b47" />

**ABOUT THE KNOWN BUG**: quests and NPCs with quotes ("") on their names break the JSON format of the "Import from raw LUA" option while parsing the .lua file. Record your gameplay or review the lines in your saved variable if you notice something is missing. For example, tasks about talking to [this NPC](https://www.wowhead.com/classic/npc=2501/sea-wolf-mackinley) won't get imported as it has quotations on its name.

#### Location

Print the current zone and coordinates on screen. Useful if you are recording gameplay with the purpose of making a guide.

Location WA
```
!WA:2!1v1tVTrru8g8HcRq8hlQLOeelUQvjqKLtkQi1kqYoSMgKJJ16nnjOkTm7mZ6DG1ZmDMztI7rloWz)rWN5K)auH6fK6Pvr9tqpWD6joYB21jPQYzp499E7BE)5373B8kDQoQkPk5pAOezMugNQ2B)GU70ZtD6EXXAQ5H)10N8E)3Fh3AgotBeJcONAKVioJJnmbFT1DCHNubgL6kf6d3W(7rUFN7psn9trJPQDrY(cnRW76Yct1x)bVXXEQGt7HgrlpKpfL(ZGfBEwBHFkQjtXD1gfJpSrSqnczwR(TBSvC9nwZMv3VYDZMnxF9nUAFo6sFopHpWHYjNPtqeXjhv2TRET5ioorO6lyCt02E9c88LUeM2w52AkSm0HYqdBeDH2kYp6s0zFjbzOrzfVEfkdmJmm8bmIjPDlqvHkWo9981gKY40MXzMAtjIWYGKefdw0jotGMz4qQs)b3rTq8FABglPrLo(kDwe9yk3miloMD68WTBniiCqql)G5LEeMWiuFBLso3I98(fNkFv5NSpKA3Ttq2AIQyAOq1TZaJrLJQjAjnnDhI2zX83cCVtzw1pVJFRD9c3V)p0kWlVM8lElAXI5MrLvI1tY00qBW)fFoegTZfnqFffAa)b9962DgbaV44aOovp0RB)o73DAgFr)7i)yl6DmnOuFxbH(Nxt(zlDcvkKFZxdZsQIJsFeGLq5XKRUe)XBUqQnhiil3LTopMnBtOAS8odseNODhlYCXzkf0jUyHqryCy2RDrCsbBRDSGBM5DQur16tqJxA9IVm2Pce5rtTOfhGhvsKbLcXUM)OSudZXhNI06A533PnmEWLcSNsTctSPAaO8LrArMctJyJKcLzPPKFrkxSgCy5Aqf14Z3(t)(B9SdO)7mfDiGC2HsBJ9kGpFjHBZgxgWzW8Kski9)(7pvttJlwPA31RtGpwKku)uf4zkIZSRhc(9Y)Wo53iV5ZPinDGbWYHMKRFgjtv85cERstXcorpX6JTwaSAeIXloyE3RNVBEV89aXQVTf5TU6DyyQGzwErLTYyK5pb3m4BhTdUhp9my7fUmypzX(QZRlVBOJciV2ShnyBFpVEQFf2myXJZ3zMrGpUKJ9Uh)46mYKZV6BYjaR4afso5GfcZJTHbAuKbvz5ST7EbAo)n(S8tp8(U3gV5gUhzFV1J527lTI3ncqNy2qh5xF1DlzmS7XWHMeGmMisjJNxo73UyOSYkRuzMfKzL98CgV88GMZmyF1VGiOVzT8BCgOgHW)2q4pp4KQA)VPrZgnRE8lp8)p
```

Prints your current coordinates and zone in chat. Can be used to copy this information to fill the data of a Goto task.

Location macro
```
/run SetMapToCurrentZone();local x,y=GetPlayerMapPosition("player");local zn=GetRealZoneText();print("{\"xCoord\": " .. string.format("%.2f",(x * 100)) .. ",\"yCoord\": " .. string.format("%.2f",(y * 100)) .. ",\"coordsMap\":\"" .. zn .. "\"}");
```

#### NPCs ids

Prints the id and name of the NPC you are targeting. Can be used to copy this information to fill the data of a Talkto, Kill or Get task.

Ids macro
```
/run local npcName, _ = UnitName("target"); local npcId = tonumber(string.sub(UnitGUID("target"),9,12),16); print("{\"npcName\": \"" .. npcName .. "\", \"npcId\": " .. npcId .. "}");
```

## Suggestions for making a guide

  * Have your own test server. More info about how to make one from Epoch's Trinity core fork [here](https://github.com/Project-Epoch/tswow).
  * Record a full 1-60 playthrough with the weakauras provided and import the SavedVariables data to the app. Fill any gaps by reviewing your recordings.
  * Have an addon that shows item and NPCs ids on their tooltip such as AnyIdTooltip.
  * Have an addon that allows you to copy and paste text from your WoW chat windows. ElvUI does this, for example.
  * Settle for a text guide with only coordinates if you don't wish to put in +100 hours into making one (even if following the above).

## How to build the app

  * Node version: 18.12.1
  * Clone the repo
  * `npm install` on the repo's folder
  * `npm run dev` to run in dev mode
  * `npm run build` to build the exe and setup wizard (/dist/releases/<release_version>)
