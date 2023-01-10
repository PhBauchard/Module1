// ///////////////////////////////
function see_evals() { 
// ///////////////////////////////
// appellé depuis index.html: stocke le prénom puis lance l'affichage de la liste des examens dans la routine wrr
// ///////////////////////////////	

//
// tableaux de stockage examens et des résultats
//
	examens=[];
	finalscore=[];
	maxscore=[];

	excompleted=[];
	nbexams=0;
	totalcompleted=0;
	noteglobale=0;

//
// structure qui sera sauvegardée en local storage et qui contiendra les tableaux précédents en format json
//

gexam = {
	examens:"",
	finalscore:"",
	maxscore:""
}

	
	prenom=this.prenom.value;
	if (prenom =="") { 
			alert("Veuillez renseigner le prénom !");
			return;
	}
        if (localStorage.getItem(prenom) == null) {
	}
	else {
		alert("Ce prénom est déjà utilisé, veuillez en choisir un autre.");
		return;
	}
//
//	Sauvegarde  en local storage du prenom en utilisant le prenom comme clé. L'idée est de renseigner le  contenu en fin de parcours par les résultats. 
//      
//
	localStorage.setItem(prenom,"init");

// on recupere le json contenant la list des examens
url="https://qcm.alwayslearn.fr/api/examens/";

    var oReq = new XMLHttpRequest(); // 
    oReq.onload = wrr;
    oReq.open("get", url, false);
    oReq.send();

}

// ///////////////////////////////
function wrr() {
// ///////////////////////////////
	resp=this.responseText;
	totalcompleted=0;
	resp=resp.replaceAll("hydra:","hydra"); // pour contourner un probleme d'acces au json
	
	struct=JSON.parse(resp);
	list=""; // cette string contiendra la liste des examens avec formatage html
	nbitems=parseInt(struct.hydratotalItems); // nombre des examens (présent dans le json)
	nbexams=nbitems;
	
	list = "<center><i class='fa-solid fa-user-graduate' style='color:orange;font-size:400%;'></i></center><br>"; // on initialise avec une petite icone academique
	for (var i = 0; i < nbitems; i++) {
				examens[i]=struct.hydramember[i].title; // on recupere le titre
				excompleted[i]=0; // on en profite pour initialiser l'etat du test
				//
				// La liste est une suite de bouton dont le titre est l'examen, chaque bouton ser traité dans fevaluate(), la variable them contient le no de l'examen
				//
				list=list+"<b><button onclick='them="+i+";fevaluate();'>Se tester sur <i class='fa-regular fa-hand-point-right' style='color:blue;font-size:150%;'></i><b> "+struct.hydramember[i].title+"</b></button>"+"<br><br>";
    	}

// gexam.examens= JSON.stringify(examens));

// recupération du code de exams.html
 
// utilisé pour les tests en local
// var loc = window.location.pathname;
// var dir = loc.substring(0, loc.lastIndexOf('/'));
// fname="file://"+dir+"/exams.html";

fname="exams.html";


readFile(fname); // module utilisé pour lire le code html, renvoyé dans la variable globale result.

// on découpe exams.html pour insérer le code au bon endroit
part1= result.substr(0,result.lastIndexOf("<!-- utiliser"));
part3= result.substr(result.lastIndexOf("ici -->")+7);
part2= list;

// construction de la nouvelle page
document.open();
document.write(part1+part2+part3);
document.close();
}

// ///////////////////////////////
function readFile(fichier) {
// ///////////////////////////////

	try {
		 //On lance la requête pour récupérer le fichier
		var fichierBrut = new XMLHttpRequest();
		fichierBrut.open("GET", fichier, false);
 		//On utilise une fonction sur l'événement "onreadystate"
		fichierBrut.onreadystatechange = function ()
			{
				if(fichierBrut.readyState === 4) {
 						//On contrôle bien quand le statut est égal à 0
						if(fichierBrut.status === 200 || fichierBrut.status == 0)
						{   									
								//On peut récupérer puis traiter le texte du fichier
								result=fichierBrut.responseText;
						}	 // if
				} //if 
			}		//function
		fichierBrut.send(null);
	} //try
	catch(err)
	{ alert(err);txtexams="";}
}


// ///////////////////////////////
function fevaluate() {
// ///////////////////////////////
// prend la main sur le click sur un examen	
// on va aller chercher le contenu de l'examen et l'analyser dans wrr2

 nocours=them+1;
 url2="https://qcm.alwayslearn.fr/api/examens/"+nocours;
 // alert(url2);

try{
    var oReq2 = new XMLHttpRequest(); // 
    oReq2.onload = wrr2;
    oReq2.open("get", url2, false);
    oReq2.send();
}
catch(err)
{
	alert(err);
}

}


// ///////////////////////////////
function wrr2() {
// ///////////////////////////////
//
//
//

// <img src="pic_trulli.jpg" alt="Trulli" width="500" height="333">

	resp2=this.responseText;
	totalscore=0;
	completed=0;
    struct2=JSON.parse(resp2); // l'object json à analyuser sera struct2
	nbquest=struct2.question.length; // donne le nombre d'entrées donc de questions de l'examen.

//
// même approche que pour la page précédente, on construit une liste formatée e, html et on l'insére dans quizz.html
// les réponses du quizz por chaque question sont des boutons à clicker, à chaque click , on a immdiatement la correction par gestion des couleur des boutons 
// Géré dans geevaluate()
	
	list="";
	noteexam="";
	titre="<center><h1>Examen: <b>"+ struct.hydramember[them].title+"<br>Score: <output style='color:blue' id='totalscore'>"+totalscore+"</output>/"+nbquest+"</b> <output style='color:yellow' id='noteexam'>"+noteexam+"</output></h1><br>";
	titre=titre+"<b><h3><button style='color:blue' onclick='retour();'>Retour vers liste des examens restant</b></button></h3><br><br></center>";
	corps="";
	
	for (var i = 0; i < struct2.question.length; i++) { // boucle sur la list des questions

		var cnt = 0;
		for (k in struct2.question[i].options) cnt++; // on récupère la liste des options
		score=0;
		question="<center> <b><h2>"+struct2.question[i].question+"<br>Score: <output style='color:blue' id='score"+i+"'>"+score+"</output></b></h2></center><br><br>";
		listoptions="";

		for (var j = 1; j < cnt+1 ;j++) { // boucle sur la liste des options
			 var tab='"'+j+'"';
			 opt=struct2.question[i].options[eval(tab)].option; // pas trouvé d'autre moyen que d'utuliser eval.. Pas terrible. 
			 opt=opt.replaceAll("<","&lt"); // pour gérer les cas avec < ou > dans le texteW...
			 opt=opt.replaceAll(">","&gt");
			 listoptions= listoptions +"<b><button id='BTN"+i+j+"' onclick='vi="+i+";vj="+j+";gevaluate();'>"+opt+"</b></button><output>   </output><i class='fa-regular fa-thumbs-up' id='pouceOK"+i+j+"'style='color:green;font-size:0%;'></i><i class='fa-regular fa-thumbs-down' id='pouceNOK"+i+j+"'style='color:red;font-size:0%;'></i><br><br>";
// <i class="fa-regular fa-thumbs-up"></i>
		 }
		corps=corps+question+listoptions;
    }
	
corps=corps+"<center><b><h3><button style='color:blue' onclick='retour();'>Retour vers liste des examens restant</b></button></h3><br><br></center>";
//
// construction de la page à afficher sur la bse de quizz.html
// même principe que la page précédente
//
// utilisé pour les tests en local
// var loc = window.location.pathname;
// var dir = loc.substring(0, loc.lastIndexOf('/'));
// fname="file://"+dir+"/quizz.html";
 
fname="quizz.html";
readFile(fname);

partquizz1= result.substr(0,result.lastIndexOf("<!-- Afficher le titre du Quizz en javascript -->"));
partquizz5= result.substr(result.lastIndexOf("quizz -->")+9);

partquizz3=result.substr(result.lastIndexOf("javascript -->")+14);
partquizz3= partquizz3.substr(0,partquizz3.lastIndexOf("<!-- utiliser "));

document.open();
document.write(partquizz1);
document.write(titre);
document.write(partquizz3);
document.write(corps);
document.write(partquizz5);
document.close();


}

// ///////////////////////////////
function gevaluate() {
// ///////////////////////////////
//
// traite le click sur une réponse
//

	bonnereponse=0;
//
// Si le bouton cliqué a un fond vert ou rouge, alors c'est que on a déjà répondu et on empeche de répondre une seconde fois.
//
	if (document.getElementById("BTN"+vi+vj).style.backgroundColor=="red") {
		alert("Réponse déjà fournie !!");
		return;
	}
	if (document.getElementById("BTN"+vi+vj).style.backgroundColor=="lightgreen") {
		alert("Réponse déjà fournie !!");
		return;
	}

//
// balayage des toutes les options de ma question.
//
// on colore le bouton en fonction de la bonne réponse et on note si le click était correct (j=vj);
//

	var cnt = 0;
	for (k in struct2.question[vi].options) cnt++;
	for (var j = 1; j < cnt+1 ;j++) {

		var tab='"'+j+'"';
		
		if (struct2.question[vi].options[eval(tab)].isCorrect ==false) {
			document.getElementById("BTN"+vi+j).style.backgroundColor="red";
			if (j==vj) { // une mauvaise réponse a été donnée 
				// positionner indicateur
				document.getElementById("pouceOK"+vi+j).style.fontSize = 0;
				document.getElementById("pouceNOK"+vi+j).style.fontSize = 30;
			}
		}
		else {
			document.getElementById("BTN"+vi+j).style.backgroundColor="lightgreen";
			if (j==vj) { // la bonne réponse a été donnée 
				bonnereponse++;
				// positionner indicateur
				document.getElementById("pouceOK"+vi+j).style.fontSize = 30;
				document.getElementById("pouceNOK"+vi+j).style.fontSize = 0;
			}
		}
	}	
//
// on met à jour les données dans la page
//
	document.getElementById("score"+vi).value=bonnereponse;
	totalscore=totalscore+bonnereponse;
	document.getElementById("totalscore").value=totalscore;
	
	completed++;
	
	if (completed==nbquest) { // on répondu à toutes les questions de la page
		maxscore[them]=nbquest;
		finalscore[them]=totalscore;
		excompleted[them]=1;
		
                note=" "+(Math.round(totalscore*200/nbquest))/10;
	        document.getElementById("noteexam").value= document.getElementById("noteexam").value + " soit "+note+"/20.";

		totalcompleted++;
		setTimeout(scorefinal,500);
	}
	
		
}

// //////////////////////////////
function scorefinal() {
// /////////////////////////////
	alert("Votre score final sur cet examen est de "+totalscore+" bonnes réponses sur "+nbquest);
	if (totalcompleted==nbexams) { // on a terminé tous les questionnaires
		totalfinal=0;
		totalmax=0;
		// calcul note globale
		notes="<h2>"+prenom+",<br> voici vos résultats:</h2>";
		for (var i = 0; i < nbexams; i++) {
			totalfinal = totalfinal+ finalscore[i];
			totalmax= totalmax + maxscore[i];
			notes=notes+"<h4>"+examens[i]+", bonnes réponses <i class='fa-regular fa-hand-point-right' style='color:orange;font-size:100%;'></i>"+finalscore[i]+"/"+maxscore[i]+"</h4><br>";
		}
		noteglobale=" "+(Math.round(totalfinal*200/totalmax))/10;
		
		alert("Votre avez terminé l'ensemble des examens, accés à la page des résultats...");

		// construction de la page pour affichage du résultat final 

//		var loc = window.location.pathname;
//		var dir = loc.substring(0, loc.lastIndexOf('/'));

		fname="result.html";
		readFile(fname);
		
		part1= result.substr(0,result.lastIndexOf("<!-- utiliser"));
		part3= result.substr(result.lastIndexOf("du quizz -->")+12);
		part2= notes+"<i class='fa-solid fa-user-graduate' style='color:orange;font-size:400%;'></i><h1>Note globale <i class='fa-regular fa-hand-point-right' style='color:orange;font-size:100%;'></i>"+noteglobale+"/20</h1>";

		document.open();
		document.write(part1+part2+part3);
		document.close();

		gexam.examens= JSON.stringify(examens);
		gexam.finalscore=JSON.stringify(finalscore);
 		gexam.maxscore=JSON.stringify(maxscore);
//
// sauvegarde des réultats en local storage
//
        	localStorage.setItem(prenom,JSON.stringify(gexam));
	}
}
// ///////////////////////////////
function retour() { 
// ///////////////////////////////
//
// Retour vers les questionnaires restant.
// On reconstruit la liste en ne mettant pas les questionnaires auxquels on a déjà répondu.
//
	if (completed < nbquest) {
		alert("Vous devez répondre à toutes les questions avant de passer au test suivant.");
		return;
	}

	list = "<center><i class='fa-solid fa-user-graduate' style='color:orange;font-size:400%;'></i></center><br>";
	for (var i = 0; i < nbitems; i++) {
		if (excompleted[i]==0) {
					list=list+"<b><button onclick='them="+i+";fevaluate();'>Se tester sur <i class='fa-regular fa-hand-point-right' style='color:blue;font-size:150%;'></i><b> "+struct.hydramember[i].title+"</b></button>"+"<br><br>";
		}	
    }
	
	document.open();
	document.write(part1+list+part3);
	document.close();
}


/* pour mémoire, json liste des examens
{
  "@context": "/api/contexts/Examen",
  "@id": "/api/examens",
  "@type": "hydra:Collection",
  "hydra:member": [
    {
      "@id": "/api/examens/1",
      "@type": "Examen",
      "id": 1,
      "title": "Les bases du HMTL et CSS"
    },
    {
      "@id": "/api/examens/2",
      "@type": "Examen",
      "id": 2,
      "title": "Les bases du PHP"
    },
    {
      "@id": "/api/examens/3",
      "@type": "Examen",
      "id": 3,
      "title": "Les bases du javascript"
    }
  ],
  "hydra:totalItems": 3
}
*/
/*

https://qcm.alwayslearn.fr/api/examens/3

{
  "@context": "/api/contexts/Examen",
  "@id": "/api/examens/3",
  "@type": "Examen",
  "id": 3,
  "title": "Les bases du javascript",
  "question": [
    {
      "@type": "Question",
      "@id": "_:551",
      "id": 5,
      "question": "Dans quel élément HTML place-t-on le JavaScript ?",
      "options": {
        "1": {
          "option": "<js>",
          "isCorrect": false
        },
        "2": {
          "option": "<javascript>",
          "isCorrect": false
        },
        "3": {
          "option": "<script>",
          "isCorrect": true
        }
      }
    },
    {
      "@type": "Question",
      "@id": "_:553",
      "id": 6,
      "question": "Dans un fichier JavaScript externe (.js), il faut",
      "options": {
        "1": {
          "option": "entourer le code avec les balises <script> et </script>.",
          "isCorrect": false
        },
        "2": {
          "option": "préciser l’encodage du fichier avec la règle @charset",
          "isCorrect": false
        },
        "3": {
          "option": "Aucune des réponses précédentes.",
          "isCorrect": true
        }
      }
    },
    {
      "@type": "Question",
      "@id": "_:554",
      "id": 7,
      "question": "Quelle méthode n'existe pas dans le DOM ?",
      "options": {
        "1": {
          "option": "document.getElementsByClassName",
          "isCorrect": false
        },
        "2": {
          "option": "document.getElementById",
          "isCorrect": false
        },
        "3": {
          "option": "document.getById",
          "isCorrect": true
        }
      }
    },
    {
      "@type": "Question",
      "@id": "_:555",
      "id": 8,
      "question": "Comment déclare t'on une constante en Javascript",
      "options": {
        "1": {
          "option": "En utilisant $",
          "isCorrect": false
        },
        "2": {
          "option": "En utilisant CONST",
          "isCorrect": true
        },
        "3": {
          "option": "En utilisant let",
          "isCorrect": false
        }
      }
    }
  ]
}
*/
