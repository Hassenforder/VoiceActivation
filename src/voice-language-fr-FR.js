function voice_language_fr_FR () {

	let dictionnaries = undefined;
	
    function buildConjugations () {
        conjugations = {};
        conjugations['actualiser'] = 'actualise, actualisez';
        conjugations['afficher'] = 'affiche,affichez';
        conjugations['aller'] = 'va,allez';
        conjugations['cacher'] = 'cache,cachez';
        conjugations['chercher'] = 'cherche,cherchez';
        conjugations['cocher'] = 'coche,cochez';
        conjugations['colorier'] = 'colorie,coloriez';
        conjugations['connecter'] = 'connecte, connectez';
        conjugations['créer'] = 'crée,créez';
        conjugations['décocher'] = 'décoche,décochez';
        conjugations['démarrer'] = 'démarre,démarrez';
        conjugations['éditer'] = 'édite,éditez';
        conjugations['exporter'] = 'exporte,exportez';
        conjugations['faire'] = 'fait, fais';
        conjugations['fermer'] = 'ferme, fermez';
        conjugations['importer'] = 'importe, importez';
        conjugations['ouvrir'] = 'ouvre, ouvrez';
        conjugations['quitter'] = 'quitte,quittez';
        conjugations['remplir'] = 'rempli';
        conjugations['sélectionner'] = 'sélectionne,sélectionnez';
        conjugations['soumettre'] = 'soumet';
        conjugations['supprimer'] = 'supprime,supprimez';
        conjugations['stopper'] = 'stoppe, stoppez';
		return conjugations;
    }

    function buildDeclinations () {
        declinations = {};
        declinations['configuration'] = 'config';
        declinations['sign in'] = 'sign-in';
        declinations['sign out'] = 'sign-out';
        declinations['mot de passe'] = 'password';
        declinations['nom'] = 'non';
        declinations['un'] = 'a,à';
        declinations['deux'] = 'de';
        declinations['voix'] = 'voit, voie';
        declinations['champ'] = 'chant';
        return declinations;
    }
    
    function buildSynonyms () {
        synonyms = {};
        return synonyms;
    }
    
    function buildTranslations () {
        translations = {};
        return translations;
    }

	if (dictionnaries === undefined) {
		dictionnaries = {};
		dictionnaries['conjugations'] = buildConjugations ();
		dictionnaries['declinations'] = buildDeclinations ();
		dictionnaries['synonyms'] = buildSynonyms ();
		dictionnaries['translations'] = buildTranslations ();
	}
	return dictionnaries;

}
