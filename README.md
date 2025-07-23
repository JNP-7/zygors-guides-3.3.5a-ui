# Zygor's guides UI

An app made to streamline the process of creating guides for the ZygorGuidesViewer 3.3.5a addon ([Link to Felbite.com](https://felbite.com/addon/4698-zygorguides/)). Used it to build [my guide for the Project Epoch launch](https://github.com/JNP-7/epoch-jubis-zygor-guide)

Built with:

  * Electron + Vite
  * React
  * React-Bootstrap

<img width="1205" height="846" alt="imagen" src="https://github.com/user-attachments/assets/69632dc7-aea8-458b-8470-a854fae9126b" />

## More info & How to use

To summarize in 2025 terms. ZygorGuidesViewer 3.3.5a is the baby version of the RestedXP addon.

Using most of the important rules and patterns provided by the "guide_format.html" file inside the ZygorGuidesViewer addon the app allows the user, through an UI, to create, edit, store and share guides for said addon.

The editor allows the user to create guides divided in sections which display a set of steps with a series of tasks to complete. The addon then uses the generated files to display the guide's information ingame and advance through the steps and sections as their respective tasks are completed.

<img width="651" height="429" alt="Captura de pantalla 2025-07-23 232742" src="https://github.com/user-attachments/assets/b244db5c-ed10-4ff1-b663-c31bd02219d5" />

The possible types of tasks that can be created as of now are:

  * Comment: shows some text.
    * Can also add and interactive icon to use an item   
  * Goto: shows some text and points the addon compass to a set of coordinates in a zone
    * Can also add and interactive icon to use an item
  * Accept/Turn in quest: instructs the addon to Accept or Turn in a quest when interacting with an NPC/game object/item that starts/ends a quest.
    * If the auto accept/turn in feature of the addon is turned on in game the addon will try to accept/turn in automatycally
  * Kill: to keep track of kill quest objectives
  * Get: to keep track of gathering quest objectives
    * Can also add which mobs drop the item, which will then show, in game, when the players reads the tooltip for the mobs
  * Goal: every other quest objective (discover, escort, etc).

Note that not every possible rule described in "guide_format.html" can be added through the app. You could add them if you wish to after generating the files

# TODO: Faltan un puñado de cosas
