const getDeleteCommentErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) {
    return '댓글 삭제에 실패했습니다';
  }

  const message = error.message.toLowerCase();

  if (message.includes('unauthorized')) {
    return '로그인이 필요합니다';
  }
  if (message.includes('forbidden')) {
    return '본인 댓글만 삭제할 수 있습니다';
  }
  if (message.includes('not found')) {
    return '이미 삭제되었거나 존재하지 않는 댓글입니다';
  }

  return '댓글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요';
};

export { getDeleteCommentErrorMessage };
