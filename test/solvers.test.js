var assert = require('assert');
import {
  compressionIRLE,
  hammingCodesIntegerToBinary,
  compressionIILZ,
} from '../solvers.js'

describe('compressionIILZ', function () {
  test('5aaabb450723abb -> aaabbaaababababaabb', function () {
    expect(compressionIILZ('5aaabb450723abb')).toEqual('aaabbaaababababaabb');
  });
  test('9spr6zj74B04zs3z525UvBes643vJM946jjJM3n86208 -> spr6zj74Bzs3z3z3z3UvBesvBesvBvJMBvJMBvJMBjjJM3njjJM3njj08', function () {
    expect(compressionIILZ('9spr6zj74B04zs3z525UvBes643vJM946jjJM3n86208')).toEqual('spr6zj74Bzs3z3z3z3UvBesvBesvBvJMBvJMBvJMBjjJM3njjJM3njj08');
  });
  test('9cQ3ppGf75022o660851i359CKCKGXL6b07taPF886492GM770963ETT -> cQ3ppGf752oGf752of752of75iof7CKCKGXL6btaPF8866btaGM66btaGM6btaGM6btETT', function () {
    expect(compressionIILZ('9cQ3ppGf75022o660851i359CKCKGXL6b07taPF886492GM770963ETT')).toEqual('cQ3ppGf752oGf752of752of75iof7CKCKGXL6btaPF8866btaGM66btaGM6btaGM6btETT');
  });
  test('5XfRXI425zRdWN411g128RhmKp3FB744xnCt214HZKS829mrnpb4C2U08jIvZh3aa654vmvm -> XfRXIXIXIzRdWNNNNNgNRhmKp3FBp3FBp3FxnCtttHZKSKSKSKSKSmrnpb4C2UjIvZh3aaZh3aaZvmvm', function () {
    expect(compressionIILZ('5XfRXI425zRdWN411g128RhmKp3FB744xnCt214HZKS829mrnpb4C2U08jIvZh3aa654vmvm')).toEqual('XfRXIXIXIzRdWNNNNNgNRhmKp3FBp3FBp3FxnCtttHZKSKSKSKSKSmrnpb4C2UjIvZh3aaZh3aaZvmvm');
  });
  // does not work :(*)
  // test('omega-net 4iyBY930712f2653l4b74963V3rgqsh134y4lF632AH -> not iyBYyBYyBYyBYYYYYYYYf2YYYf2Yl4bYl4bYl4l4bYl4l4bV3rgqshqy4lF4lF4lFAH, but iyBYyBYyBYyBYYYYYYYYf2YYYf2Yl4bYl4bYl463V3rgqshqy4lF4lF4lFAH', function () {
  //   expect(compressionIILZ('4iyBY930712f2653l4b74963V3rgqsh134y4lF632AH')).toEqual('iyBYyBYyBYyBYYYYYYYYf2YYYf2Yl4bYl4bYl463V3rgqshqy4lF4lF4lFAH');
  // });
  test('9TkGOFUpA005FBWju645xzYWj3480GlIFp8Q530659oW3dDE54Q07yBE5i1F -> TkGOFUpA0FBWjuBWjuBWxzYWjzYW0GlIFp8Qp8Qp8p8Qp8poW3dDE54QyBE5i1F', function () {
    expect(compressionIILZ('9TkGOFUpA005FBWju645xzYWj3480GlIFp8Q530659oW3dDE54Q07yBE5i1F')).toEqual('TkGOFUpA0FBWjuBWjuBWxzYWjzYW0GlIFp8Qp8Qp8p8Qp8poW3dDE54QyBE5i1F');
  });
  test('8726Q8FN6676DzBS3P944OU3u277f1ZMIXT662S0649mnHSbsNF1135dFtzg -> 726Q8FN626Q8FNDzBS3PBS3PBS3PBOU3u3Pf1ZMIXT1ZMIXTS0XTS0XTmnHSbsNF1NdFtzg', function () {
    expect(compressionIILZ('8726Q8FN6676DzBS3P944OU3u277f1ZMIXT662S0649mnHSbsNF1135dFtzg')).toEqual('726Q8FN626Q8FNDzBS3PBS3PBS3PBOU3u3Pf1ZMIXT1ZMIXTS0XTS0XTmnHSbsNF1NdFtzg');
  });
  /*
      7v67M066560586hs7b67342yS87645uyO6127njn5jzm692gW1876d0fXmL5713:
        chunks: 7v67M066,56,0,58,6hs7b67,34,2yS,87,64,5uyO61
        notParsed: 27njn5jzm692gW1876d0fXmL5713
        output: v67M06667M0606667hs7b677b6yS677b6yS66yS66yuyO61
  */
  // test('7v67M066560586hs7b67342yS87645uyO6127njn5jzm692gW1876d0fXmL5713 -> stam', function () {
  //   expect(compressionIILZ('7v67M066560586hs7b67342yS87645uyO6127njn5jzm692gW1876d0fXmL5713')).toEqual('stam');
  // });
});
