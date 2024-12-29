/**
 * エラーが発生した場合も、確実にレスポンスを返す
 */
function ensureResponse (callback: Function, errMsg: string, finallyCallback = () => { }) {
  return async function (req: any, res: any, next: any) {
    try {
      await callback(req, res, next);
    }
    catch (e) {
      console.log(e);
      let msg = errMsg;
      res.status(500).send({ error: msg });
    }
    finally {
      finallyCallback();
    }
  };
};

export {
  ensureResponse,
}