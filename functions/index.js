/* eslint-disable */
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.saveLastMessage = functions.firestore
  .document("/chats/{chatId}/messages/{messageId}")
  .onCreate((snap, context) => {
    
    const chatId = context.params.chatId;
    
    //Pega os dados da mensagem recém-criada
    const messageDoc = snap.data();
    const userFrom = messageDoc.from;

    return new Promise((resolve, reject) => {
      
      // Busca os dados do Chat (para saber quem está conversando)
      const chatRef = db.collection("chats").doc(chatId);

      chatRef.get().then((chatSnap) => {
        const chatDoc = chatSnap.data();

        // Substitui as 80 linhas do professor para o código atual em 1 única linha
        const b64UserFrom = Buffer.from(userFrom).toString('base64');

        // Filtra os usuários do chat para achar quem é o destinatário (o "userTo")
        const b64UserTo = Object.keys(chatDoc.users).filter(key => key !== b64UserFrom)[0];
        
        // Decodifica o e-mail do destinatário
        const userTo = Buffer.from(b64UserTo, 'base64').toString('utf-8');

        //Salva a última mensagem na lista de contatos do destinatário
        db.collection("users")
          .doc(userTo)
          .collection("contacts")
          .doc(b64UserFrom)
          .set({
            lastMessage: messageDoc.content,
            lastMessageTime: new Date()
          }, { merge: true })
          .then(() => {
            console.log("✅ Última mensagem atualizada com sucesso para:", userTo);
            resolve(true); // Termina a função com sucesso
          })
          .catch((err) => {
            console.error("❌ Erro ao atualizar o contato:", err);
            reject(err);
          });

      }).catch(err => {
        console.error("❌ Erro ao buscar o chat:", err);
        reject(err);
      });
    });
  });