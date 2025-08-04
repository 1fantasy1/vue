import os
import json
from typing import Optional, List
from datetime import datetime

# AI 相关导入（需要安装相应的包）
try:
    import openai
    from sentence_transformers import SentenceTransformer
    import faiss
    import numpy as np
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False
    print("AI 相关包未安装，AI 功能将被禁用")

from ..config import settings


class AIService:
    def __init__(self):
        self.ai_available = AI_AVAILABLE
        if self.ai_available:
            # 初始化 OpenAI
            if settings.openai_api_key:
                openai.api_key = settings.openai_api_key
            
            # 初始化句子嵌入模型
            try:
                self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
                self.embedding_dim = 384
            except:
                self.embedding_model = None
                print("嵌入模型加载失败")
            
            # 初始化向量数据库
            self.vector_index = None
            self.document_texts = []
            self.document_ids = []
    
    def extract_text_from_file(self, file_path: str, file_type: str) -> str:
        """从文件中提取文本"""
        try:
            if file_type.lower() == 'txt':
                with open(file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            
            elif file_type.lower() == 'pdf':
                try:
                    import PyPDF2
                    with open(file_path, 'rb') as f:
                        reader = PyPDF2.PdfReader(f)
                        text = ""
                        for page in reader.pages:
                            text += page.extract_text()
                        return text
                except ImportError:
                    return "PDF 处理库未安装"
            
            elif file_type.lower() in ['doc', 'docx']:
                try:
                    import docx2txt
                    return docx2txt.process(file_path)
                except ImportError:
                    return "Word 文档处理库未安装"
            
            else:
                return "不支持的文件类型"
                
        except Exception as e:
            return f"文件处理错误: {str(e)}"
    
    def generate_summary(self, text: str, max_length: int = 200) -> str:
        """生成文档摘要"""
        if not self.ai_available or not settings.openai_api_key:
            # 简单的摘要生成
            sentences = text.split('。')
            return '。'.join(sentences[:3]) + '...' if len(sentences) > 3 else text
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是一个文档摘要专家，请为以下文档生成简洁的摘要。"},
                    {"role": "user", "content": f"请为以下文档生成不超过{max_length}字的摘要：\n\n{text[:2000]}"}
                ],
                max_tokens=max_length,
                temperature=0.3
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"摘要生成失败: {e}")
            # 回退到简单摘要
            sentences = text.split('。')
            return '。'.join(sentences[:3]) + '...' if len(sentences) > 3 else text
    
    def extract_keywords(self, text: str, max_keywords: int = 10) -> List[str]:
        """提取关键词"""
        if not self.ai_available or not settings.openai_api_key:
            # 简单的关键词提取
            words = text.split()
            return list(set(words[:max_keywords]))
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "你是一个关键词提取专家，请从文档中提取最重要的关键词。"},
                    {"role": "user", "content": f"请从以下文档中提取{max_keywords}个最重要的关键词，用逗号分隔：\n\n{text[:1000]}"}
                ],
                max_tokens=100,
                temperature=0.3
            )
            keywords = response.choices[0].message.content.split(',')
            return [kw.strip() for kw in keywords]
        except Exception as e:
            print(f"关键词提取失败: {e}")
            # 回退到简单提取
            words = text.split()
            return list(set(words[:max_keywords]))
    
    def add_document_to_index(self, document_id: int, text: str):
        """将文档添加到向量索引"""
        if not self.ai_available or not self.embedding_model:
            return
        
        try:
            # 分割文档为较小的块
            chunks = self.split_text(text, chunk_size=500)
            
            for i, chunk in enumerate(chunks):
                # 生成嵌入向量
                embedding = self.embedding_model.encode([chunk])
                
                # 初始化索引（如果需要）
                if self.vector_index is None:
                    self.vector_index = faiss.IndexFlatIP(self.embedding_dim)
                
                # 添加到索引
                self.vector_index.add(embedding.astype('float32'))
                self.document_texts.append(chunk)
                self.document_ids.append(f"{document_id}_{i}")
                
        except Exception as e:
            print(f"向量索引添加失败: {e}")
    
    def split_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """将文本分割为块"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
            
        return chunks
    
    def search_similar_documents(self, query: str, top_k: int = 5) -> List[dict]:
        """搜索相似文档"""
        if not self.ai_available or not self.embedding_model or not self.vector_index:
            return []
        
        try:
            # 生成查询嵌入
            query_embedding = self.embedding_model.encode([query])
            
            # 搜索相似文档
            scores, indices = self.vector_index.search(
                query_embedding.astype('float32'), top_k
            )
            
            results = []
            for score, idx in zip(scores[0], indices[0]):
                if idx < len(self.document_texts):
                    results.append({
                        "text": self.document_texts[idx],
                        "score": float(score),
                        "document_id": self.document_ids[idx]
                    })
            
            return results
            
        except Exception as e:
            print(f"相似文档搜索失败: {e}")
            return []
    
    def answer_question(self, question: str, context: str = "") -> dict:
        """AI 问答"""
        if not self.ai_available or not settings.openai_api_key:
            return {
                "answer": "AI 服务不可用，请检查配置",
                "confidence": 0.0,
                "sources": []
            }
        
        try:
            # 搜索相关文档
            similar_docs = self.search_similar_documents(question, top_k=3)
            
            # 构建上下文
            context_text = context
            if similar_docs:
                context_text += "\n\n相关文档内容：\n"
                for doc in similar_docs:
                    context_text += f"- {doc['text'][:200]}...\n"
            
            # 生成回答
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": "你是一个智能教学助手，基于提供的文档内容回答用户问题。如果文档中没有相关信息，请明确说明。"
                    },
                    {
                        "role": "user", 
                        "content": f"问题：{question}\n\n上下文：{context_text}"
                    }
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            answer = response.choices[0].message.content
            
            return {
                "answer": answer,
                "confidence": 0.8,  # 可以根据实际情况调整
                "sources": [doc["document_id"] for doc in similar_docs]
            }
            
        except Exception as e:
            print(f"AI 问答失败: {e}")
            return {
                "answer": f"抱歉，处理您的问题时出现错误：{str(e)}",
                "confidence": 0.0,
                "sources": []
            }


# 全局 AI 服务实例
ai_service = AIService()
