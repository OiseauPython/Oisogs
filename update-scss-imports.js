import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const componentsDir = join(__dirname, 'src/components');
const viewsDir = join(__dirname, 'src/views');

function processFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  
  // Supprimer les lignes d'import SCSS
  let updatedContent = content
    .replace(/@use\s+['"]@\/assets\/variables\.scss['"]\s+as\s+\*;?\s*/g, '')
    .replace(/@use\s+['"]@\/assets\/mixin\.scss['"]\s+as\s+\*;?\s*/g, '');
    
  // Nettoyer les lignes vides supplémentaires
  updatedContent = updatedContent
    .replace(/\n{3,}/g, '\n\n')
    .replace(/<style[^>]*>\s*\/\/\s*Les imports sont gérés par Vite dans vite\.config\.js/,
             '<style lang="scss" scoped>');
  
  // Ajouter le commentaire si c'est un fichier Vue avec une balise style
  if (filePath.endsWith('.vue') && content.includes('<style')) {
    const withComment = updatedContent.replace(
      /(<style[^>]*>)/,
      '$1\n// Les imports sont gérés par Vite dans vite.config.js\n\n'
    );
    
    if (content !== withComment) {
      writeFileSync(filePath, withComment, 'utf-8');
      console.log(`Updated: ${filePath}`);
    }
  } else if (content !== updatedContent) {
    writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(directory) {
  const files = readdirSync(directory);
  
  files.forEach(file => {
    const filePath = join(directory, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.vue') || file.endsWith('.scss')) {
      processFile(filePath);
    }
  });
}

// Traiter les composants et les vues
processDirectory(componentsDir);
processDirectory(viewsDir);

console.log('Mise à jour des imports SCSS terminée !');
