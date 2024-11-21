useEffect(() => {
  console.log('Usuário carregado:', user);
  if (user) {
    if (user.pesquisador !== undefined) {
      console.log('Pesquisador:', user.pesquisador);
      if (user.pesquisador) {
        navigate('/Researcher');
      } else {
        navigate('/NotResearcher');
      }
    } else {
      console.warn('Propriedade pesquisador não encontrada no objeto user.');
      navigate('/NotResearcher');
    }
  }
}, [user, navigate]);
