# D3on
D3on is a simple collection of **ideas** and components developed using the **D3 js** library. They can be used to **improve the design** of a webpage or to give a **fancier look** to a particular component.

### Status: V 0.4

## Contents
- **fancy-s3t**: a customizable set of moving and interactive nodes, to display a list of skills, products and so on! The list is taken from a json file, and a variety of animations and actions are possible.
- **rad3ar**: a radar-style (also called star or spider or Kiviat plot) interactive and customizable visualization. The data-points are taken from a json file and can be focused and animated easily.
- **svgreat**: a simple svg visualization, where an svg is splitted in pieces, and the properties of each piece are controlled from a json. Useful to obtain animated icons and logos. I suggest to use Inkscape to split a single svg in multiple pieces. **[WIP]**
- **sparky-icon**: just select the id of a div or img tag in your page, choose an image and select the effects to apply, to obtain a vivid and animated image or icon. Just make sure to select an icon or an image! **[WIP]**

## Avoid cross origin requests
When the component uses a json or an image, you can't simply open the html page. To test locally, you have to run a simple http server on your machine. If you have python3 installed, you can do that opening a cmd or terminal in the project folder and typing `python -m http.server 8080` or `python3 -m http.server 8080`. Now just open your browser and type `http://localhost:8000` in the address bar. 

## Generic Usage
Just download or clone the project, and **copy** the desired component in your webpage. Make sure to customize it and connect it with the right elements. You can easily embed the js part in the html page using the script tag. For easier understanding, every component was splitted in **css**, **html** and **js** files, plus a **json** containing data or graphic resources, if needed. **D3 v5**, **D3 v4** and **D3 v3** were used. 